import { FormEvent, useState, useEffect } from 'react'
import style from './home.module.css'
import { BsSearch } from 'react-icons/bs'
import { Link, useNavigate } from 'react-router-dom'


export interface CoinProps {
    id: string;
    name: string;
    symbol: string;
    supply: string;
    maxSupply: string;
    marketCapUsd: string;
    volumeUsd24Hr: string;
    priceUsd: string;
    changePercent24Hr: string;
    vwap24Hr: string;
    explorer: string;
    formatedPrice?: string;
    formatedMarkt?: string;
    formatedVolume?: string;
}
interface DataProps {
    data: CoinProps[]
}


export function Home() {
    const [input, setInput] = useState("");
    const [coins, setCoins] = useState<CoinProps[]>([]);
    const [offset, setOffset] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        getData();
    }, [offset])

    async function getData() {
        fetch(`https://api.coincap.io/v2/assets?limit=10&offset=${offset}`).then(response => response.json()).then((data: DataProps) => {
            const coinsData = data.data

            const price = Intl.NumberFormat("en-us", {
                style: "currency",
                currency: "USD"
            })
            const priceCompact = Intl.NumberFormat("en-us", {
                style: "currency",
                currency: "USD",
                notation: "compact"
            })

            const formatedResult = coinsData.map((item) => {
                const formated = {
                    ...item,
                    formatedPrice: price.format(Number(item.priceUsd)),
                    formatedMarkt: priceCompact.format(Number(item.marketCapUsd)),
                    formatedVolume: priceCompact.format(Number(item.volumeUsd24Hr)),


                }
                return formated;
            })
            setCoins(formatedResult)

        })
    }

    function handleSubimit(e: FormEvent) {
        e.preventDefault();
        if (input === "") return;
        navigate(`/detalhes/${input}`)
    }
    function handleGetMoreUp() {
        if(offset === 0){
            setOffset(10)
            return;
        }
        setOffset(offset + 10)
    }
    function handleGetMoreDown() {
        if(offset === 0){
            return;
        }
        setOffset(offset - 10)
    }

    return (
        <main className={style.container}>
            <form className={style.form} onSubmit={handleSubimit}>
                <input type="text"
                    placeholder='Digite o nome da moeda... EX bitcoin'
                    value={input}
                    onChange={(e) => setInput(e.target.value)} />
                <button type='submit'>
                    <BsSearch size={30} color='#fff' />
                </button>
            </form>
            <table>
                <thead>
                    <tr>
                        <th scope='col'>Moeda</th>
                        <th scope='col'>Valor merdado</th>
                        <th scope='col'>Preço</th>
                        <th scope='col'>Volume</th>
                        <th scope='col'>Mudança 24h</th>
                    </tr>
                </thead>
                <tbody id='tboby'>
                    {coins.length > 0 && coins.map((item) => (
                        <tr className={style.tr} key={item.id}>
                            <td className={style.tdLabel} data-label="Moeda">
                                <div className={style.name}>
                                    <img className={style.logo}
                                    src={`https://assets.coincap.io/assets/icons/${item.symbol.toLowerCase()}@2x.png`} alt="Logo Cripto" />
                                    <Link to={`/detalhes/${item.id}`}>
                                        <span>{item.name}</span> | {item.symbol}
                                    </Link>
                                </div>
                            </td>
                            <td className={style.tdLabel} data-label="Valor merdado">
                                {item.formatedMarkt}
                            </td>
                            <td className={style.tdLabel} data-label="Preço">
                                {item.formatedPrice}
                            </td>
                            <td className={style.tdLabel} data-label="Volume">
                                {item.formatedVolume}
                            </td>
                            <td className={Number(item.changePercent24Hr) > 0 ? style.tdProfit : style.tdLoss } data-label="Mudança 24h">
                                <span>{Number(item.changePercent24Hr).toFixed(2)}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button className={style.buttonMore} onClick={handleGetMoreDown}>
                Voltar
            </button>
            <button className={style.buttonMore} onClick={handleGetMoreUp}>
                Carregar mais!
            </button>


        </main>

    )
}

