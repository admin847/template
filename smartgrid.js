const smartgrid = require('smart-grid');

const settings = {
    filename: '_smart-grid',
    outputStyle: 'sass',
    columns: 12,
    offset: '15px',
    container: {
        maxWidth: '1535px',
        fields: '30px'
    },
    breakPoints: {
        lg: {
            width: "1145px",
            fields: "15px"
        },
        md: {
            width: "960px",
            fields: "15px"
        },
        sm: {
            width: "720px",
            fields: "10px"
        },
        xs: {
            width: "576px",
            fields: "5px"
        },
        xxs: {
            width: "380px",
            fields: "5px"
        }
    },
    oldSizeStyle: false,
    properties: [
        'justify-content'
    ]
};

smartgrid('./src/assets/styles/',  settings);