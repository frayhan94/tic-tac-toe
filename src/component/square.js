export default function Square({onClick,value,squares}) {
    return (
        <button className="square" onClick={() => {
            onClick(value);
        }}>
            {squares[value]}
        </button>
    );
}



