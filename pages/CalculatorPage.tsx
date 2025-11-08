
import React, { useState } from 'react';

const CalculatorPage: React.FC = () => {
    const [display, setDisplay] = useState('0');
    const [currentValue, setCurrentValue] = useState<number | null>(null);
    const [operator, setOperator] = useState<string | null>(null);
    const [waitingForOperand, setWaitingForOperand] = useState(false);

    const handleDigitClick = (digit: string) => {
        if (waitingForOperand) {
            setDisplay(digit);
            setWaitingForOperand(false);
        } else {
            setDisplay(display === '0' ? digit : display + digit);
        }
    };

    const handleOperatorClick = (nextOperator: string) => {
        const inputValue = parseFloat(display);

        if (currentValue === null) {
            setCurrentValue(inputValue);
        } else if (operator) {
            const result = calculate(currentValue, inputValue, operator);
            setCurrentValue(result);
            setDisplay(String(result));
        }

        setWaitingForOperand(true);
        setOperator(nextOperator);
    };
    
    const calculate = (firstOperand: number, secondOperand: number, operator: string): number => {
        switch (operator) {
            case '+': return firstOperand + secondOperand;
            case '-': return firstOperand - secondOperand;
            case '*': return firstOperand * secondOperand;
            case '/': return firstOperand / secondOperand;
            case '=': return secondOperand;
            default: return secondOperand;
        }
    };

    const handleEqualsClick = () => {
        const inputValue = parseFloat(display);
        if (operator && currentValue !== null) {
            const result = calculate(currentValue, inputValue, operator);
            setCurrentValue(result);
            setDisplay(String(result));
            setOperator(null);
            setWaitingForOperand(true);
        }
    };

    const handleClearClick = () => {
        setDisplay('0');
        setCurrentValue(null);
        setOperator(null);
        setWaitingForOperand(false);
    };
    
    const buttons = [
        '7', '8', '9', '/',
        '4', '5', '6', '*',
        '1', '2', '3', '-',
        '0', '.', '=', '+'
    ];
    
    const getButtonAction = (btn: string) => {
        if (!isNaN(parseInt(btn)) || btn === '.') return () => handleDigitClick(btn);
        if (['+', '-', '*', '/'].includes(btn)) return () => handleOperatorClick(btn);
        if (btn === '=') return handleEqualsClick;
        return () => {};
    };

    return (
        <div className="flex justify-center items-center">
            <div className="w-full max-w-xs bg-white dark:bg-lynix-dark-blue shadow-2xl rounded-2xl p-4 space-y-4">
                <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-lg text-right text-3xl font-mono overflow-x-auto">
                    {display}
                </div>
                <div className="grid grid-cols-4 gap-2">
                     <button onClick={handleClearClick} className="col-span-4 bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-lg text-xl transition">AC</button>
                    {buttons.map(btn => (
                        <button key={btn} onClick={getButtonAction(btn)}
                            className={`font-bold py-4 rounded-lg text-xl transition
                                ${!isNaN(parseInt(btn)) || btn === '.' ? 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600' : ''}
                                ${['+', '-', '*', '/'].includes(btn) ? 'bg-lynix-orange hover:bg-lynix-orange/90 text-white' : ''}
                                ${btn === '=' ? 'bg-lynix-blue hover:bg-lynix-blue/90 text-white' : ''}
                            `}
                        >
                            {btn}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CalculatorPage;
