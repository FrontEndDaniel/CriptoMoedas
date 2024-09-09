import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { CoinProps } from '../home/index'
import style  from './detail.module.css'
interface responseData {
    data: CoinProps
}
interface ErrorData {
    error: string
}

type DataProps = responseData | ErrorData


export function Detail() {

    const { cripto } = useParams();
    const navigate = useNavigate();
    const [coin, setCoin] = useState<CoinProps>();
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function getCoin() {
            try {

                fetch(`https://api.coincap.io/v2/assets/${cripto}`).then(response => response.json()).then((data: DataProps) => {
                    if ("error" in data) {
                        navigate("/")
                        return;
                    }
                    const price = Intl.NumberFormat("en-us", {
                        style: "currency",
                        currency: "USD"
                    })
                    const priceCompact = Intl.NumberFormat("en-us", {
                        style: "currency",
                        currency: "USD",
                        notation: "compact"
                    })

                    const resultData = {
                        ...data.data,
                        formatedPrice: price.format(Number(data.data.priceUsd)),
                        formatedMarkt: priceCompact.format(Number(data.data.marketCapUsd)),
                        formatedVolume: priceCompact.format(Number(data.data.volumeUsd24Hr)),
                    }
                    setCoin(resultData)
                    setLoading(false)
                })

            } catch (error) {
                console.log(error)
                navigate("/")
            }
        }
        getCoin();
    }, [cripto])
    if (loading || !coin) {
        return (
            <div className={style.container}>
                <h4 className={style.center}>Carregando Detalhes.....</h4>
            </div>
        )

    }
    return (
        <div className={style.container}>
            <h1 className={style.center}>{coin?.name}</h1>
            <h1 className={style.center}>{coin?.symbol}</h1>

            <section className={style.content}>
                <img className={style.logo}
                    src={`https://assets.coincap.io/assets/icons/${coin?.symbol.toLowerCase()}@2x.png`} alt="Logo Cripto" />
                    <h1>{coin?.name} | {coin?.symbol}</h1>
                    <p><strong>Preço: </strong> {coin?.formatedPrice}</p>
                    <a><strong>Mercado: </strong>{coin?.formatedMarkt}</a>
                    <a><strong>Volume: </strong>{coin?.formatedVolume}</a>
                    <a><strong>Mudança 24hr: </strong><span className={Number(coin.changePercent24Hr) > 0 ? style.profit : style.loss }> {Number(coin.changePercent24Hr).toFixed(2)}</span></a>
            </section>
        </div>

    )
}

