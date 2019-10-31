module.exports = {
    parser: 'postcss-scss',
    plugins: [
        require('postcss-sassy-import')(),
        require('autoprefixer')({
            cascade: false,
        }),
    ],
};
