import * as React from 'react';
import * as MuiIcons from '@mui/icons-material';
import type { SvgIconProps } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

export const getMuiIcon = (iconName: string | any, props?: SvgIconProps, label?: string) => {
    const IconComponent = (
        MuiIcons as Record<string, React.ElementType>
    )[String(iconName)];
    return IconComponent
        ? React.createElement(IconComponent, props)
        : label?.length
            ? label[0]
            : React.createElement(HelpOutlineIcon, props);
};
