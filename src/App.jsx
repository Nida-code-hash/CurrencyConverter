import { useEffect, useState } from 'react';
import { InputBox } from './components';
import useCurrencyInfo from './hooks/useCurrencyInfo';
import SelectCurrency from 'react-select-currency'


const currencyNames = [
    "USD", "AED", "AFN", "ALL", "AMD", "ANG", "AOA", "ARS", "AUD", "AWG", "AZN",
    "BAM", "BBD", "BDT", "BGN", "BHD", "BIF", "BMD", "BND", "BOB", "BRL",
    "BSD", "BTN", "BWP", "BYN", "BZD", "CAD", "CDF", "CHF", "CLP", "CNY",
    "COP", "CRC", "CUP", "CVE", "CZK", "DJF", "DKK", "DOP", "DZD", "EGP",
    "ERN", "ETB", "EUR", "FJD", "FKP", "FOK", "GBP", "GEL", "GGP", "GHS",
    "GIP", "GMD", "GNF", "GTQ", "GYD", "HKD", "HNL", "HRK", "HTG", "HUF",
    "IDR", "ILS", "IMP", "INR", "IQD", "IRR", "ISK", "JEP", "JMD", "JOD",
    "JPY", "KES", "KGS", "KHR", "KID", "KMF", "KRW", "KWD", "KYD", "KZT",
    "LAK", "LBP", "LKR", "LRD", "LSL", "LYD", "MAD", "MDL", "MGA", "MKD",
    "MMK", "MNT", "MOP", "MRU", "MUR", "MVR", "MWK", "MXN", "MYR", "MZN",
    "NAD", "NGN", "NIO", "NOK", "NPR", "NZD", "OMR", "PAB", "PEN", "PGK",
    "PHP", "PKR", "PLN", "PYG", "QAR", "RON", "RSD", "RUB", "RWF", "SAR",
    "SBD", "SCR", "SDG", "SEK", "SGD", "SHP", "SLE", "SLL", "SOS", "SRD",
    "SSP", "STN", "SYP", "SZL", "THB", "TJS", "TMT", "TND", "TOP", "TRY",
    "TTD", "TVD", "TWD", "TZS", "UAH", "UGX", "UYU", "UZS", "VES",
    "VND", "VUV", "WST", "XAF", "XCD", "XOF", "XPF", "YER", "ZAR", "ZMW", "ZWL"
];


function App() {
    const [selectedCurrency, setSelectedCurrency] = useState('USD');
    const [amount, setAmount] = useState(1);
    const [from, setFrom] = useState("usd");
    const [to, setTo] = useState("btc");
    const [convertedAmount, setConvertedAmount] = useState(0);
    const [isSwapped, setIsSwapped] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const currencyInfo = useCurrencyInfo(from.toLowerCase());
    const options = Object.keys(currencyInfo);

    const handleCurrencyChange = (currencyAbbrev) => {
        setSelectedCurrency(currencyAbbrev);
    };

    const convert = () => {
        const rate = currencyInfo[to.toLowerCase()];
        if (rate) {
            setConvertedAmount(amount * rate);
        } else {
            setConvertedAmount(0);
        }
    };

    const swap = () => {
        const prevFrom = from;
        const prevTo = to;
        const prevAmount = amount;
        const prevConvertedAmount = convertedAmount;

        setFrom(prevTo);
        setTo(prevFrom);
        setAmount(prevConvertedAmount);
        setConvertedAmount(prevAmount);
        setIsSwapped(prev => !prev);
    };

    // Debounced convert only when typing
    useEffect(() => {
        if (isTyping && amount && !isNaN(amount)) {
            const timer = setTimeout(() => {
                convert();
                setIsTyping(false);
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [amount, from, to, currencyInfo, isTyping]);

    return (
        <div
            className="w-full h-screen flex flex-wrap justify-center items-center bg-cover bg-no-repeat"
            style={{
                backgroundImage: `url('https://images.pexels.com/photos/3532540/pexels-photo-3532540.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')`,
            }}
        >
            <div className="w-full">
                <div className="w-full max-w-md mx-auto border border-gray-60 rounded-lg p-5 backdrop-blur-sm bg-white/30">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            convert();
                        }}
                    >
                        {!isSwapped ? (
                            <>
                                {/* <SelectCurrency value={selectedCurrency} onCurrencySelected={handleCurrencyChange}/> */}

                                <InputBox
                                    label="From"
                                    amount={amount}
                                    currencyOptions={currencyNames}
                                    onCurrencyChange={(currency) => setFrom(currency)}
                                    selectCurrency={from}
                                    onAmountChange={(amt) => {
                                        setAmount(amt);
                                        setIsTyping(true);
                                    }}
                                />
                                <div className="relative w-full h-0.5 my-2">
                                    <button
                                        type="button"
                                        className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-white rounded-md bg-blue-600 text-white px-2 py-0.5"
                                        onClick={swap}
                                    >
                                        swap
                                    </button>
                                </div>
                                <InputBox
                                    label="To"
                                    amount={convertedAmount}
                                    currencyOptions={options}
                                    onCurrencyChange={(currency) => setTo(currency)}
                                    selectCurrency={to}
                                    amountDisable
                                />
                            </>
                        ) : (
                            <>
                                <InputBox
                                    label="From"
                                    amount={amount}
                                    currencyOptions={options}
                                    onCurrencyChange={(currency) => setFrom(currency)}
                                    selectCurrency={from}
                                    onAmountChange={(amt) => {
                                        setAmount(amt);
                                        setIsTyping(true);
                                    }}
                                />
                                <div className="relative w-full h-0.5 my-2">
                                    <button
                                        type="button"
                                        className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-white rounded-md bg-blue-600 text-white px-2 py-0.5"
                                        onClick={swap}
                                    >
                                        swap
                                    </button>
                                </div>
                                <InputBox
                                    label="To"
                                    amount={convertedAmount}
                                    currencyOptions={currencyNames}
                                    onCurrencyChange={(currency) => setTo(currency)}
                                    selectCurrency={to}
                                    amountDisable
                                />
                            </>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white px-4 py-3 mt-4 rounded-lg"
                        >
                            Convert {from.toUpperCase()} to {to.toUpperCase()}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default App;



// import React from 'react';
// import SelectCurrency from 'react-select-currency';

// const onSelectedCurrency = (currencyAbbrev) => {
// };

// function MyComponent() {
//     return (
//         <div>
//             <SelectCurrency value="USD" onCurrencySelected={onSelectedCurrency} />
//         </div>
//     );
// }

// export default MyComponent;






// import React, { useState } from 'react';
// import SelectCurrency from 'react-select-currency';

// function MyComponent() {
//     const [selectedCurrency, setSelectedCurrency] = useState('USD');

//     const handleCurrencyChange = (currencyAbbrev) => {
//         setSelectedCurrency(currencyAbbrev);
//     };

//     return (
//         <div>
//             <SelectCurrency value={selectedCurrency} onCurrencySelected={handleCurrencyChange}/>
//         </div>
//     );
// }

// export default MyComponent;



