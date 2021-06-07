import React from 'react';
import Square from'./square';

export default function Board({ onClick,squares}) {
    const board = [0,1,2,3,4,5,6,7,8];
    return (
    <div className={'boardWrapper'}>
        {
            board.map((value,key) => {
                return (
                    <React.Fragment key={key}>
                        <Square onClick={onClick} squares={squares} value={value} />
                    </React.Fragment>
                )
            })
        }
    </div>
    );
}
