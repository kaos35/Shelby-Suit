// Manual mock for uuid package (ESM-only, can't be transformed by Jest)
let counter = 0;
module.exports = {
    v4: () => `mock-uuid-${++counter}`,
};
