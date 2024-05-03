import { formatUnits } from 'ethers'

export const getBettingOptionsPromise = (eventInfo: any) => {
    let promises = [];
    for (let i = 0; i < eventInfo.bettingOptions.length; i++) {
        const contractPromise1 = fetch(`${process.env.REACT_APP_SERVER_URL}/api/contract/getBetAmountOfBettingOption/${eventInfo.bettingOptions[i]}`)
            .then((response) => response.json())
            .then(({ betAmount }) => ({
                bet: Number(formatUnits(betAmount, 6))
            }));

        const contractPromise2 = fetch(`${process.env.REACT_APP_SERVER_URL}/api/contract/getResultOfBettingOption/${eventInfo.bettingOptions[i]}`)
            .then((response) => response.json())
            .then(({ result }) => ({
                result: Number(result)
            }));

        const ipfsPromise = fetch(`https://gateway.pinata.cloud/ipfs/${eventInfo.bettingOptions[i]}`).then((response) => response.json()).then(optionInfo => ({
            title: optionInfo.title,
            image: optionInfo.image
        }));

        promises.push(Promise.all([contractPromise1, contractPromise2, ipfsPromise])
            .then((results) => (Object.assign({ ipfsUrl: eventInfo.bettingOptions[i] }, ...results))))
    }
    return Promise.all(promises);
}

export function roundToTwo(num: number) {
    return Number(num.toFixed(2));
  }