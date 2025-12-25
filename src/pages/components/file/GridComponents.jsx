import React, { forwardRef } from 'react';

export const GridComponents = {
    List: forwardRef(({ style, children }, ref) => (
        <div
            ref={ref}
            style={style}
            className="grid-wrapper"
        >
            {children}
        </div>
    )),
    Item: ({ children }) => (
        <div>
            {children}
        </div>
    )
};