import { useState } from 'react';
import { Button } from '@/components/ui/button';

function App() {
    const [count, setCount] = useState(0);

    return (
        <div className="flex flex-col items-center">
            <p className="text-center">Count: {count}</p>
            <Button className="cursor-pointer" onClick={() => setCount((c) => c + 1)}>
                Plus 1
            </Button>
        </div>
    );
}

export default App;
