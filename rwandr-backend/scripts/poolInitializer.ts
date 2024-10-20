import { ethers } from 'hardhat'
import NonfungiblePositionManagerABI from '../abis/NonfungiblePositionManager.json'
import UniswapV3Factory from '../abis/UniswapV3Factory.json'

async function main() {
    const [deployer] = await ethers.getSigners()

    console.log('Rwandr - WETH pool is initializing on Uniswap V3...')
    const token0 = '0xb4ca4966d5d3D19ABff5024e125B82A929B73768' // Rwandr Token Address on Sepolia
    const token1 = '0x4200000000000000000000000000000000000006' // WETH Token Address on Sepolia
    const fee = 10000n // 1% fee
    const sqrtPriceX96 = 792281625000000000000000000n // 1/10000 price ratio

    // Token and pool parameters are defined:
    // - token0 and token1 represent the pair of tokens for the pool, with your ERC-404 token and WETH.
    // - fee denotes the pool's fee tier, affecting trading fees and potential liquidity provider earnings.
    // - sqrtPriceX96 is an encoded value representing the initial price of the pool, set based on the desired price ratio.
    const contractAddress = {
        uniswapV3NonfungiblePositionManager:
            '0x27F971cb582BF9E50F397e4d29a5C7A34f11faA2',
        uniswapV3Factory: '0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24',
    }

    // Contract instances for interacting with Uniswap V3's NonfungiblePositionManager and Factory.
    const nonfungiblePositionManagerContract = new ethers.Contract(
        contractAddress.uniswapV3NonfungiblePositionManager,
        NonfungiblePositionManagerABI,
        deployer
    )

    const uniswapV3FactoryContract = new ethers.Contract(
        contractAddress.uniswapV3Factory,
        UniswapV3Factory,
        deployer
    )

    const my404Contract = await ethers.getContractAt('My404', token0, deployer)

    // Creating the pool on Uniswap V3 by specifying the tokens, fee, and initial price.
    let tx =
        await nonfungiblePositionManagerContract.createAndInitializePoolIfNecessary(
            token0,
            token1,
            fee,
            sqrtPriceX96
        )

    await tx.wait()

    console.log(`Tx hash for initializing a pool on Uniswap V3: ${tx.hash}`)

    // Retrieving the newly created pool's address to interact with it further.
    const pool = await uniswapV3FactoryContract.getPool(token0, token1, fee)

    console.log(`The pool address: ${pool}`)

    // Whitelisting the Uniswap V3 pool address in your ERC-404 token contract.
    // This step is crucial to bypass the token's built-in protections or requirements for minting and burning,
    // which may be triggered during liquidity provision or trading on Uniswap.
    console.log('Uniswap V3 Pool address is being whitelisted...')
    tx = await my404Contract.setWhitelist(pool, true)
    tx.wait()
    console.log(`Tx hash for whitelisting Uniswap V3 pool: ${tx.hash}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch(error => {
    console.error(error)
    process.exitCode = 1
})