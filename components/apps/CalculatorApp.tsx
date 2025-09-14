"use client";

import { useState } from "react";

interface CalculatorAppProps {
  windowId: string;
  isDarkMode?: boolean;
}

export default function CalculatorApp({ windowId, isDarkMode = false }: CalculatorAppProps) {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".");
    }
  };

  const clear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case "+":
        return firstValue + secondValue;
      case "-":
        return firstValue - secondValue;
      case "×":
        return firstValue * secondValue;
      case "÷":
        return firstValue / secondValue;
      case "=":
        return secondValue;
      default:
        return secondValue;
    }
  };

  const handleEquals = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const handlePercentage = () => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  };

  const handlePlusMinus = () => {
    const value = parseFloat(display);
    setDisplay(String(value * -1));
  };

  const Button = ({ 
    onClick, 
    className = "", 
    children, 
    variant = "default" 
  }: { 
    onClick: () => void; 
    className?: string; 
    children: React.ReactNode;
    variant?: "default" | "operator" | "function" | "zero";
  }) => {
    const baseClasses = "h-16 rounded-full font-medium text-lg transition-all duration-150 active:scale-95 select-none";
    
    const variantClasses = {
      default: isDarkMode 
        ? "bg-gray-700 hover:bg-gray-600 text-white" 
        : "bg-gray-300 hover:bg-gray-200 text-black",
      operator: "bg-orange-500 hover:bg-orange-400 text-white",
      function: isDarkMode 
        ? "bg-gray-600 hover:bg-gray-500 text-white" 
        : "bg-gray-400 hover:bg-gray-300 text-black",
      zero: isDarkMode 
        ? "bg-gray-700 hover:bg-gray-600 text-white col-span-2" 
        : "bg-gray-300 hover:bg-gray-200 text-black col-span-2"
    };

    return (
      <button
        onClick={onClick}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      >
        {children}
      </button>
    );
  };

  return (
    <div className={`h-full p-4 flex flex-col ${
      isDarkMode ? 'bg-black' : 'bg-gray-100'
    }`}>
      {/* Display */}
      <div className={`text-right text-4xl font-light p-4 mb-4 min-h-[80px] flex items-end justify-end ${
        isDarkMode ? 'bg-black text-white' : 'bg-white text-black border border-gray-300'
      }`}>
        <div className="truncate">
          {display}
        </div>
      </div>

      {/* Button Grid */}
      <div className="grid grid-cols-4 gap-3 flex-1">
        {/* Row 1 */}
        <Button onClick={clear} variant="function">
          AC
        </Button>
        <Button onClick={handlePlusMinus} variant="function">
          ±
        </Button>
        <Button onClick={handlePercentage} variant="function">
          %
        </Button>
        <Button 
          onClick={() => performOperation("÷")} 
          variant="operator"
          className={operation === "÷" ? "bg-white text-orange-500" : ""}
        >
          ÷
        </Button>

        {/* Row 2 */}
        <Button onClick={() => inputNumber("7")}>
          7
        </Button>
        <Button onClick={() => inputNumber("8")}>
          8
        </Button>
        <Button onClick={() => inputNumber("9")}>
          9
        </Button>
        <Button 
          onClick={() => performOperation("×")} 
          variant="operator"
          className={operation === "×" ? "bg-white text-orange-500" : ""}
        >
          ×
        </Button>

        {/* Row 3 */}
        <Button onClick={() => inputNumber("4")}>
          4
        </Button>
        <Button onClick={() => inputNumber("5")}>
          5
        </Button>
        <Button onClick={() => inputNumber("6")}>
          6
        </Button>
        <Button 
          onClick={() => performOperation("-")} 
          variant="operator"
          className={operation === "-" ? "bg-white text-orange-500" : ""}
        >
          −
        </Button>

        {/* Row 4 */}
        <Button onClick={() => inputNumber("1")}>
          1
        </Button>
        <Button onClick={() => inputNumber("2")}>
          2
        </Button>
        <Button onClick={() => inputNumber("3")}>
          3
        </Button>
        <Button 
          onClick={() => performOperation("+")} 
          variant="operator"
          className={operation === "+" ? "bg-white text-orange-500" : ""}
        >
          +
        </Button>

        {/* Row 5 */}
        <Button onClick={() => inputNumber("0")} variant="zero">
          0
        </Button>
        <Button onClick={inputDecimal}>
          .
        </Button>
        <Button onClick={handleEquals} variant="operator">
          =
        </Button>
      </div>
    </div>
  );
}
