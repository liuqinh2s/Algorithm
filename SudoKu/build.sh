cd SudoKu
tsc ../DancingLinksX/DancingLinksX.ts --target es2016
tsc ./SudoKu.ts --target es2016
rollup ./SudoKu.js --file ./bundle.js