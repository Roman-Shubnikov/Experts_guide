import React from 'react';
import {IconManager} from './iconManager'
export const Verified = props => {
    return(
        <IconManager settings={{...props, size: 16, viewBox: '0 0 22 23'}}>
            <g clipPath="url(#a)">
            <path d="M11 22.206c6.075 0 11-4.925 11-11s-4.925-11-11-11-11 4.925-11 11 4.925 11 11 11Z" fill="#07F"/>
            <path d="M6.816 11.265a1.375 1.375 0 0 0-1.945 1.945l3.094 3.093a1.375 1.375 0 0 0 1.945 0l7.218-7.218a1.375 1.375 0 1 0-1.944-1.945l-6.246 6.247-2.122-2.122Z" fill="#fff"/>
            </g><defs><clipPath id="a"><path fill="#fff" transform="translate(0 .206)" d="M0 0h22v22H0z"/></clipPath></defs>
        </IconManager>
    )
}