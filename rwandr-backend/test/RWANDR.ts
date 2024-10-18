import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers'
import { expect } from 'chai'
import { ethers } from 'hardhat'
import { Rwandr } from '../typechain-types'

describe('Rwandr', function () {
    let rwandr: Rwandr
    let owner: SignerWithAddress
    let addr1: SignerWithAddress
    let addr2: SignerWithAddress

    beforeEach(async function () {
        // Get signers
        ;[owner, addr1, addr2] = await ethers.getSigners()

        // Deploy the Rwandr contract
        rwandr = await ethers.deployContract('Rwandr', [owner.address], owner)
    })

    it('Should set the right owner', async function () {
        expect(await rwandr.owner()).to.equal(owner.address)
    })

    it('Should update baseTokenURI', async function () {
        const newURI = 'ipfs://newBaseURI/'
        await rwandr.connect(owner).setTokenURI(newURI)
        expect(await rwandr.baseTokenURI()).to.equal(newURI)
    })

    it('Should revert when non-owner tries to set baseTokenURI', async function () {
        const newURI = 'ipfs://newBaseURI/'
        await expect(
            rwandr.connect(addr1).setTokenURI(newURI)
        ).to.be.revertedWithCustomError(rwandr, 'Unauthorized')
    })

    it('Should update dataURI', async function () {
        const newDataURI = 'ipfs://newDataURI/'
        await rwandr.connect(owner).setDataURI(newDataURI)
        expect(await rwandr.dataURI()).to.equal(newDataURI)
    })

    it('Should revert when non-owner tries to set dataURI', async function () {
        const newDataURI = 'ipfs://newDataURI/'
        await expect(
            rwandr.connect(addr1).setDataURI(newDataURI)
        ).to.be.revertedWithCustomError(rwandr, 'Unauthorized')
    })

    it('Should update name and symbol', async function () {
        const newName = 'NewName'
        const newSymbol = 'NN'
        await rwandr.connect(owner).setNameSymbol(newName, newSymbol)
        expect(await rwandr.name()).to.equal(newName)
        expect(await rwandr.symbol()).to.equal(newSymbol)
    })

    it('Should revert when non-owner tries to set name and symbol', async function () {
        const newName = 'NewName'
        const newSymbol = 'NN'
        await expect(
            rwandr.connect(addr1).setNameSymbol(newName, newSymbol)
        ).to.be.revertedWithCustomError(rwandr, 'Unauthorized')
    })

    it('Should return the correct tokenURI', async function () {
        const baseTokenURI = 'ipfs://baseTokenURI/'
        await rwandr.connect(owner).setTokenURI(baseTokenURI)
        const tokenId = 1 // Example token ID
        expect(await rwandr.tokenURI(tokenId)).to.equal(baseTokenURI)
    })
})