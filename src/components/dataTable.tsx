import React, { Fragment, useState } from 'react';
import {
    Table, TableBody, TableContainer, TableRow, Paper, TablePagination, TableHead,
    TableCell, TableSortLabel, IconButton, Popover, MenuList, MenuItem, ListItemIcon,
    ListItemText, Tooltip, Card,
} from '@mui/material';
import {
    Download, KeyboardArrowDown, KeyboardArrowUp, MoreVert, ToggleOff, ToggleOn,
} from '@mui/icons-material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { isEqualNumber, ddmmyyyy, hhmm, NumberFormat } from '../utils/helper';

declare module 'jspdf' {
    interface jsPDF {
        autoTable: (options: any) => jsPDF;
    }
}

declare module 'jspdf-autotable';

type DataType = 'string' | 'number' | 'date' | 'time';

export interface Column {
    Field_Name?: string;
    Fied_Data?: DataType;
    verticalAlign?: 'top' | 'middle' | 'bottom' | 'center';
    ColumnHeader?: string;
    tdClass?: (args: { row: any; Field_Name?: string; index: number }) => string;
    isVisible?: 0 | 1;
    Defult_Display?: 0 | 1 | boolean;
    align?: 'left' | 'right' | 'center';
    isCustomCell?: boolean;
    Cell?: (args: { row: any; Field_Name?: string; index: number }) => React.ReactNode;
}

export interface Menu {
    name?: string;
    icon?: React.ReactNode;
    onclick?: () => void;
    disabled?: boolean;
}

export interface FilterableTableProps {
    dataArray?: any[];
    columns?: Column[];
    onClickFun?: ((row: any) => void) | null;
    isExpendable?: boolean;
    expandableComp?: ((args: { row: any; index: number }) => React.ReactNode) | null;
    tableMaxHeight?: number;
    initialPageCount?: number;
    EnableSerialNumber?: boolean;
    CellSize?: 'small' | 'medium';
    disablePagination?: boolean;
    title?: string;
    PDFPrintOption?: boolean;
    ExcelPrintOption?: boolean;
    maxHeightOption?: boolean;
    ButtonArea?: React.ReactNode;
    MenuButtons?: Menu[];
    bodyFontSizePx?: number;
    headerFontSizePx?: number;
}

type SortDirection = 'asc' | 'desc';

interface SortCriterion {
    columnId: string;
    direction: SortDirection;
}

const preprocessDataForExport = (data: any[], columns: Column[]) => {
    return data.map((row) => {
        const flattenedRow: Record<string, any> = {};

        columns.forEach((column, index) => {
            if (column.isVisible || column.Defult_Display) {
                if (column.isCustomCell && column.Cell) {
                    const cellContent = column.Cell({ row, Field_Name: column.Field_Name, index });

                    const safeColumnHeader = column.ColumnHeader
                        ? String(column.ColumnHeader).replace(/\s+/g, '_').toLowerCase()
                        : `field_${index + 1}`;

                    if (
                        typeof cellContent === 'string' ||
                        typeof cellContent === 'number' ||
                        typeof cellContent === 'bigint'
                    ) {
                        flattenedRow[safeColumnHeader] = cellContent;
                    }
                } else {
                    const key = column.Field_Name;
                    if (key) {
                        flattenedRow[key] = row[key] ?? '';
                    }
                }
            }
        });

        return flattenedRow;
    });
};

const generatePDF = (dataArray: any[], columns: Column[]) => {
    try {
        const doc = new jsPDF();
        const processedData = preprocessDataForExport(dataArray, columns);

        const headers: string[] = columns
            .filter((column) => column.isVisible || column.Defult_Display)
            .map((column, idx) =>
                column.Field_Name
                    ? column.Field_Name
                    : (column.ColumnHeader ?? `field_${idx + 1}`).replace(/\s+/g, '_').toLowerCase()
            );

        const rows: Array<Record<string, any>> = processedData.map((row, i) => ({
            ...row,
            Sno: i + 1,
        }));

        doc.autoTable({
            head: [headers],
            body: rows.map((r) => headers.map((h) => r[h] ?? '')),
        });

        doc.save('table.pdf');
    } catch (e) {
        console.error(e);
    }
};

const exportToExcel = (dataArray: any[], columns: Column[]) => {
    try {
        const processedData = preprocessDataForExport(dataArray, columns);

        const worksheet = XLSX.utils.json_to_sheet(processedData);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
        XLSX.writeFile(workbook, 'table.xlsx');
    } catch (e) {
        console.error(e);
    }
};

const createCol = (
    field = '',
    type: DataType = 'string',
    ColumnHeader = '',
    align: 'left' | 'right' | 'center' = 'left',
    verticalAlign: 'top' | 'middle' | 'bottom' | 'center' = 'center',
    isVisible: 0 | 1 = 1
): Column => {
    return {
        isVisible,
        Field_Name: field,
        Fied_Data: type,
        align,
        verticalAlign,
        ...(ColumnHeader && { ColumnHeader }),
    };
};

const ButtonActions: React.FC<{ buttonsData?: Menu[]; ToolTipText?: string }> = ({
    buttonsData = [],
    ToolTipText = 'Options',
}) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const popOverOpen = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Tooltip title={ToolTipText}>
                <IconButton
                    aria-describedby={popOverOpen ? 'menu-popover' : undefined}
                    onClick={handleClick}
                    className="ml-2"
                    size="small"
                >
                    <MoreVert />
                </IconButton>
            </Tooltip>

            <Popover
                id="menu-popover"
                open={popOverOpen}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <MenuList>
                    {buttonsData.map((btn, btnKey) => (
                        <MenuItem
                            key={btnKey}
                            onClick={() => btn?.onclick && btn?.onclick()}
                            disabled={btn?.disabled}
                        >
                            <ListItemIcon>{btn?.icon}</ListItemIcon>
                            <ListItemText>{btn?.name}</ListItemText>
                        </MenuItem>
                    ))}
                </MenuList>
            </Popover>
        </>
    );
};

const formatString = (val: any, dataType?: DataType) => {
    switch (dataType) {
        case 'number':
            return val ? NumberFormat(val) : val;
        case 'date':
            return val ? ddmmyyyy(val) : val;
        case 'time':
            return val ? hhmm(val) : val;
        case 'string':
            return val;
        default:
            return '';
    }
};

const FilterableTable: React.FC<FilterableTableProps> = ({
    dataArray = [],
    columns = [],
    onClickFun = null,
    isExpendable = false,
    expandableComp = null,
    tableMaxHeight = 550,
    initialPageCount = 20,
    EnableSerialNumber = false,
    CellSize = 'small',
    disablePagination = false,
    title = '',
    PDFPrintOption = false,
    ExcelPrintOption = false,
    maxHeightOption = false,
    ButtonArea = null,
    MenuButtons = [],
    bodyFontSizePx = 13,
    headerFontSizePx = 13,
}) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(initialPageCount);
    const [sortCriteria, setSortCriteria] = useState<SortCriterion[]>([]);
    const [showFullHeight, setShowFullHeight] = useState(true);
    const tableHeight = showFullHeight && maxHeightOption ? 'max-content' : tableMaxHeight;

    const columnAlign: { type: 'left' | 'right' | 'center'; class: string }[] = [
        { type: 'left', class: 'text-left' },
        { type: 'right', class: 'text-right' },
        { type: 'center', class: 'text-center' },
    ];

    const columnVerticalAlign: { type: string; class: string }[] = [
        { type: 'top', class: 'align-top' },
        { type: 'bottom', class: 'align-bottom' },
        { type: 'center', class: 'align-middle' },
        { type: 'middle', class: 'align-middle' },
    ];

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSortRequest = (columnId?: string) => {
        if (!columnId) return;
        const existingCriteria = sortCriteria.find((criteria) => criteria.columnId === columnId);
        if (existingCriteria) {
            const isAsc = existingCriteria.direction === 'asc';
            setSortCriteria(
                sortCriteria.map((criteria) =>
                    criteria.columnId === columnId
                        ? { ...criteria, direction: isAsc ? 'desc' : 'asc' }
                        : criteria
                )
            );
        } else {
            setSortCriteria([...sortCriteria, { columnId, direction: 'asc' }]);
        }
    };

    const sortData = (data: any[]) => {
        if (!sortCriteria.length) return data;

        const sortedData = [...data].sort((a, b) => {
            for (const criteria of sortCriteria) {
                const { columnId, direction } = criteria;
                const aValue = a[columnId];
                const bValue = b[columnId];

                if (aValue !== bValue) {
                    if (direction === 'asc') {
                        return aValue > bValue ? 1 : -1;
                    } else {
                        return aValue < bValue ? 1 : -1;
                    }
                }
            }
            return 0;
        });

        return sortedData;
    };

    const sortedData = sortData(dataArray);
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedData = sortedData.slice(startIndex, endIndex);

    const RowComp: React.FC<{ row: any; index: number }> = ({ row, index }) => {
        const [open, setOpen] = useState(false);
        const iconFontSize = '20px';

        return (
            <Fragment>
                <TableRow>
                    {isExpendable === true && expandableComp && (
                        <TableCell
                            className="border-r border-gray-300 text-center align-top"
                            sx={{ fontSize: `${bodyFontSizePx}px` }}
                        >
                            <IconButton size="small" onClick={() => setOpen((pre) => !pre)}>
                                {open ? (
                                    <KeyboardArrowUp sx={{ fontSize: iconFontSize }} />
                                ) : (
                                    <KeyboardArrowDown sx={{ fontSize: iconFontSize }} />
                                )}
                            </IconButton>
                        </TableCell>
                    )}

                    {EnableSerialNumber === true && (
                        <TableCell
                            className="border-r border-gray-300 text-center align-top"
                            sx={{ fontSize: `${bodyFontSizePx}px` }}
                        >
                            {rowsPerPage * page + index + 1}
                        </TableCell>
                    )}

                    {columns?.map((column, columnInd) => {
                        const isColumnVisible =
                            isEqualNumber(column?.Defult_Display, 1) || isEqualNumber(column?.isVisible, 1);
                        const isCustomCell = Boolean(column?.isCustomCell) && column.Cell;
                        const isCommonValue = !isCustomCell;

                        const tdClass = (row: any, Field_Name: string | undefined, tdIndex: number) =>
                            column?.tdClass ? ` ${column?.tdClass({ row, Field_Name, index: tdIndex })} ` : '';

                        const horizondalalignClass = column.align
                            ? columnAlign.find((align) => align.type === String(column.align).toLowerCase())
                                ?.class
                            : '';

                        const verticalAlignClass = column.verticalAlign
                            ? columnVerticalAlign.find(
                                (align) => align.type === String(column.verticalAlign).toLowerCase()
                            )?.class
                            : 'align-middle';

                        if (isColumnVisible && isCommonValue) {
                            const foundEntry = column.Field_Name
                                ? Object.entries(row).find(([key]) => key === column.Field_Name)
                                : undefined;

                            return (
                                <TableCell
                                    key={columnInd}
                                    className={`border-r border-gray-300 ${horizondalalignClass} ${verticalAlignClass} ${tdClass(
                                        row,
                                        column.Field_Name,
                                        index
                                    )}`}
                                    sx={{ fontSize: `${bodyFontSizePx}px` }}
                                    onClick={() =>
                                        onClickFun ? onClickFun(row) : console.log('Function not supplied')
                                    }
                                >
                                    {foundEntry
                                        ? formatString(foundEntry[1], column?.Fied_Data)
                                        : '-'}
                                </TableCell>
                            );
                        }

                        if (isColumnVisible && isCustomCell && column.Cell) {
                            return (
                                <TableCell
                                    key={columnInd}
                                    className={`border-r border-gray-300 ${horizondalalignClass} ${verticalAlignClass} ${tdClass(
                                        row,
                                        column.Field_Name,
                                        index
                                    )}`}
                                    sx={{ fontSize: `${bodyFontSizePx}px` }}
                                >
                                    {column.Cell({ row, Field_Name: column.Field_Name, index })}
                                </TableCell>
                            );
                        }

                        return (
                            <TableCell
                                key={columnInd}
                                sx={{ fontSize: `${bodyFontSizePx}px` }}
                                className={`border-r border-gray-300 ${horizondalalignClass} ${verticalAlignClass}`}
                            >
                                -
                            </TableCell>
                        );
                    })}
                </TableRow>

                {isExpendable === true && expandableComp && open && (
                    <TableRow>
                        <TableCell
                            colSpan={Number(columns?.length) + (EnableSerialNumber === true ? 2 : 1)}
                        >
                            {expandableComp({ row, index })}
                        </TableCell>
                    </TableRow>
                )}
            </Fragment>
        );
    };

    return (
        <Card
            className="rounded-lg bg-white overflow-hidden"
            component={Paper}
            elevation={1}
        >
            <div className="flex items-center flex-wrap px-3 py-2 flex-row-reverse gap-2">
                {(PDFPrintOption || ExcelPrintOption || MenuButtons.length > 0 || maxHeightOption) && (
                    <ButtonActions
                        ToolTipText="Table Options"
                        buttonsData={[
                            ...(maxHeightOption
                                ? [
                                    {
                                        name: 'Max Height',
                                        icon: showFullHeight ? (
                                            <ToggleOn fontSize="small" color="primary" />
                                        ) : (
                                            <ToggleOff fontSize="small" />
                                        ),
                                        onclick: () => setShowFullHeight((pre) => !pre),
                                        disabled: isEqualNumber(dataArray?.length, 0),
                                    } as Menu,
                                ]
                                : []),
                            ...(PDFPrintOption
                                ? [
                                    {
                                        name: 'PDF Print',
                                        icon: <Download fontSize="small" color="primary" />,
                                        onclick: () => generatePDF(dataArray, columns),
                                        disabled: isEqualNumber(dataArray?.length, 0),
                                    } as Menu,
                                ]
                                : []),
                            ...(ExcelPrintOption
                                ? [
                                    {
                                        name: 'Excel Print',
                                        icon: <Download fontSize="small" color="primary" />,
                                        onclick: () => exportToExcel(dataArray, columns),
                                        disabled: isEqualNumber(dataArray?.length, 0),
                                    } as Menu,
                                ]
                                : []),
                            ...MenuButtons,
                        ]}
                    />
                )}
                {ButtonArea && ButtonArea}
                {title && (
                    <h6 className="font-semibold text-gray-500 flex-1 m-0">{title}</h6>
                )}
            </div>

            <TableContainer sx={{ maxHeight: tableHeight }}>
                <Table stickyHeader size={CellSize}>
                    <TableHead>
                        <TableRow>
                            {isExpendable && expandableComp && (
                                <TableCell
                                    className="font-semibold border-r border-gray-300 text-center"
                                    sx={{ fontSize: `${headerFontSizePx}px`, backgroundColor: '#EDF0F7' }}
                                >
                                    #
                                </TableCell>
                            )}

                            {EnableSerialNumber && (
                                <TableCell
                                    className="font-semibold border-r border-gray-300 text-center"
                                    sx={{ fontSize: `${headerFontSizePx}px`, backgroundColor: '#EDF0F7' }}
                                >
                                    SNo
                                </TableCell>
                            )}

                            {columns.map((column, ke) => {
                                const isColumnVisible =
                                    isEqualNumber(column?.Defult_Display, 1) ||
                                    isEqualNumber(column?.isVisible, 1);
                                const isSortable =
                                    Boolean(column?.isCustomCell) === false || !column.Cell;
                                const sortCriteriaMatch = column.Field_Name
                                    ? sortCriteria.find((criteria) => criteria.columnId === column.Field_Name)
                                    : undefined;
                                const sortDirection: SortDirection = sortCriteriaMatch
                                    ? sortCriteriaMatch.direction
                                    : 'asc';

                                if (isColumnVisible) {
                                    return isSortable && column.Field_Name ? (
                                        <TableCell
                                            key={ke}
                                            className={
                                                'font-semibold border-r border-gray-300 ' +
                                                (column.align
                                                    ? columnAlign.find(
                                                        (align) => align.type === String(column.align).toLowerCase()
                                                    )?.class
                                                    : '')
                                            }
                                            sx={{ fontSize: `${headerFontSizePx}px`, backgroundColor: '#EDF0F7' }}
                                            sortDirection={sortCriteriaMatch ? sortDirection : false}
                                        >
                                            <TableSortLabel
                                                active={!!sortCriteriaMatch}
                                                direction={sortDirection}
                                                onClick={() => handleSortRequest(column.Field_Name)}
                                            >
                                                {column.ColumnHeader || column?.Field_Name?.replace(/_/g, ' ')}
                                            </TableSortLabel>
                                        </TableCell>
                                    ) : (
                                        <TableCell
                                            key={ke}
                                            className={
                                                `${(column.ColumnHeader || column?.Field_Name)
                                                    ? 'font-semibold border-r border-gray-300 px-2 py-1'
                                                    : 'p-0'
                                                } ` +
                                                (column.align
                                                    ? columnAlign.find(
                                                        (align) => align.type === String(column.align).toLowerCase()
                                                    )?.class
                                                    : '')
                                            }
                                            sx={{ fontSize: `${headerFontSizePx}px`, backgroundColor: '#EDF0F7' }}
                                        >
                                            {column.ColumnHeader || column?.Field_Name?.replace(/_/g, ' ')}
                                        </TableCell>
                                    );
                                }
                                return null;
                            })}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {(disablePagination ? sortedData : paginatedData).map((row, index) => (
                            <RowComp key={index} row={row} index={index} />
                        ))}
                        {dataArray.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={
                                        columns.length +
                                        (isExpendable === true && expandableComp ? 1 : 0) +
                                        (EnableSerialNumber === true ? 1 : 0)
                                    }
                                    className="text-center"
                                >
                                    No Data
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {!disablePagination && paginatedData.length !== 0 && (
                <div className="p-2 pb-0">
                    <TablePagination
                        component="div"
                        count={dataArray.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={Array.from(new Set([initialPageCount, 5, 20, 50, 100, 200, 500])).sort(
                            (a, b) => a - b
                        )}
                        labelRowsPerPage="Rows per page"
                        showFirstButton
                        showLastButton
                    />
                </div>
            )}
        </Card>
    );
};

export default FilterableTable;
export { createCol, ButtonActions, formatString };
