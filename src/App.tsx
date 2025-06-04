import { useState } from 'react';

function App() {
    const [count, setCount] = useState(0);

    return (
        <>
            <div className="text-center" onClick={() => setCount((c) => c + 1)}>
                Count: {count}
            </div>
        </>
    );
}

export default App;
