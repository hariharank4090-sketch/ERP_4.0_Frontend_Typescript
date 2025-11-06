import type { MenuRow } from "../modules/configuration/types";


export function buildMaps(rows: MenuRow[]) {
    const byId = new Map<number, MenuRow>();
    const children = new Map<number | null, MenuRow[]>();
    rows.forEach((r) => {
        byId.set(r.menuId, r);
        const key = r.parentId ?? null;
        if (!children.has(key)) children.set(key, []);
        children.get(key)!.push(r);
    });
    return { byId, children };
}

export function computeFullPath(row: MenuRow, byId: Map<number, MenuRow>): string {
    const parts: string[] = [];
    let cur: MenuRow | undefined | null = row;
    const guard = new Set<number>();
    while (cur) {
        if (guard.has(cur.menuId)) break; // safety on accidental cycles
        guard.add(cur.menuId);
        parts.unshift(cur.slug);
        cur = cur.parentId ? byId.get(cur.parentId) : null;
    }
    return "/" + parts.join("/");
}

export function buildDepth(row: MenuRow, byId: Map<number, MenuRow>): number {
    let depth = 0;
    let cur: MenuRow | undefined | null = row;
    const guard = new Set<number>();
    while (cur && cur.parentId) {
        if (guard.has(cur.menuId)) break;
        guard.add(cur.menuId);
        depth++;
        cur = byId.get(cur.parentId);
    }
    return depth;
}

export function buildFullPath(menu: MenuTreeNode, byId: Map<number, MenuTreeNode>): string {
    const parts: string[] = [];
    let cur: MenuTreeNode | undefined | null = menu;
    const guard = new Set<number>();
    while (cur) {
        if (guard.has(cur.menuId)) break;
        guard.add(cur.menuId);
        parts.unshift(cur.slug);
        cur = cur.parentId ? byId.get(cur.parentId) ?? null : null;
    }
    return "/" + parts.join("/");
}

export function computePathSort(row: MenuRow, byId: Map<number, MenuRow>): string {
    const parts: string[] = [];
    let cur: MenuRow | undefined | null = row;
    const guard = new Set<number>();
    while (cur) {
        if (guard.has(cur.menuId)) break;
        guard.add(cur.menuId);
        const so = cur.sortOrder == null ? 1000 : cur.sortOrder;
        parts.unshift(String(so).padStart(6, "0") + ":" + (cur.slug || ""));
        cur = cur.parentId ? byId.get(cur.parentId) : null;
    }
    return parts.join("/");
}

export function collectDescendants(rootId: number, childrenMap: Map<number | null, MenuRow[]>): Set<number> {
    const out = new Set<number>();
    const stack: number[] = [rootId];
    while (stack.length) {
        const id = stack.pop()!;
        const kids = childrenMap.get(id) || [];
        for (const k of kids) {
            out.add(k.menuId);
            stack.push(k.menuId);
        }
    }
    return out; // menuIds
}

export interface MenuTreeNode extends MenuRow {
    fullPath: string;
    children: MenuTreeNode[];
}

export function buildMenuTree(menus: MenuRow[]): MenuTreeNode[] {
    const byId = new Map<number, MenuRow>();
    menus.forEach((m) => byId.set(m.menuId, m));

    // compute fullPath from ancestors
    const getFullPath = (m: MenuRow): string => {
        const parts: string[] = [];
        let cur: MenuRow | undefined | null = m;
        const guard = new Set<number>();
        while (cur) {
            if (guard.has(cur.menuId)) break;
            guard.add(cur.menuId);
            parts.unshift(cur.slug);
            cur = cur.parentId ? byId.get(cur.parentId) ?? null : null;
        }
        return "/" + parts.join("/");
    };

    // create all nodes (with extra fields)
    const nodeMap = new Map<number, MenuTreeNode>();
    menus.forEach((m) => {
        nodeMap.set(m.menuId, {
            ...m,
            fullPath: "",     // fill later
            children: [],
        });
    });

    const roots: MenuTreeNode[] = [];

    // link children + fill fullPath
    menus.forEach((m) => {
        const node = nodeMap.get(m.menuId)!;
        node.fullPath = getFullPath(m);

        if (m.parentId == null) {
            roots.push(node);
        } else {
            const parentNode = nodeMap.get(m.parentId);
            if (parentNode) {
                parentNode.children.push(node);
            } else {
                // parent missing: treat as root
                roots.push(node);
            }
        }
    });

    // optional: sort by sortOrder, then title
    const sortTree = (nodes: MenuTreeNode[]) => {
        nodes.sort((a, b) => {
            const as = a.sortOrder ?? 1000;
            const bs = b.sortOrder ?? 1000;
            if (as !== bs) return as - bs;
            return a.title.localeCompare(b.title);
        });
        nodes.forEach((n) => sortTree(n.children));
    };
    sortTree(roots);

    return roots;
}

function normalizePath(p: string): string {
    if (!p) return "/";
    // remove trailing slash except '/'
    if (p.length > 1 && p.endsWith("/")) {
        return p.slice(0, -1);
    }
    return p;
}

export function findMenuChainByPath(
    tree: MenuTreeNode[],
    pathname: string
): MenuTreeNode[] {
    // normalize: remove trailing slash except root
    const norm = normalizePath(pathname);

    // DFS that carries the path
    const stack: MenuTreeNode[] = [];

    const dfs = (nodes: MenuTreeNode[]): MenuTreeNode[] | null => {
        for (const node of nodes) {
            stack.push(node);

            if (normalizePath(node.fullPath) === norm) {
                return [...stack]; // found, return a copy
            }

            if (node.children && node.children.length > 0) {
                const found = dfs(node.children);
                if (found) return found;
            }

            stack.pop();
        }
        return null;
    };

    const result = dfs(tree);
    return result ?? [];
}

export function findMenuByPath(
    tree: MenuTreeNode[],
    pathname: string
): MenuTreeNode | Record<string, any> {
    const target = normalizePath(pathname);

    const dfs = (nodes: MenuTreeNode[]): MenuTreeNode | null => {
        for (const node of nodes) {
            if (normalizePath(node.fullPath) === target) {
                return node;
            }
            if (node.children && node.children.length) {
                const found = dfs(node.children);
                if (found) return found;
            }
        }
        return null;
    };

    return dfs(tree) || {};
}