// import { useEffect, useState } from 'react';
// import type { Product } from '../types';

// type Props = {
//     onSubmit: (payload: Record<string, any>, image?: File | null) => Promise<void>;
//     initial?: Partial<Product>;
//     submitText?: string;
//     onCancel?: () => void;
// };

// export default function ProductForm({ onSubmit, initial, submitText = 'Create', onCancel }: Props) {
//     const [products, setProducts] = useState<Product[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [editing, setEditing] = useState<Product | null>(null);

//     function spinOn() { setLoading(true); }
//     function spinOff() { setLoading(false); }

//     async function load() {
//         setLoading(true);
//         try {
//             const data = await listProducts();
//             setProducts(data);
//         } finally {
//             setLoading(false);
//         }
//     }

//     useEffect(() => { load(); }, []);

//     async function handleCreate(payload: Record<string, any>, image?: File | null) {
//         await createProduct(payload, image ?? null, { on: spinOn, off: spinOff });
//         await load();
//     }

//     async function handleUpdate(payload: Record<string, any>, image?: File | null) {
//         if (!editing) return;
//         await updateProduct(editing.Product_Id, payload, image ?? null, { on: spinOn, off: spinOff });
//         setEditing(null);
//         await load();
//     }

//     async function handleDelete(id: number) {
//         if (!confirm(`Delete product ${id}?`)) return;
//         await deleteProduct(id, { on: spinOn, off: spinOff });
//         await load();
//     }

//     // ...render unchanged
// }
