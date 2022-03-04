const fs = require('fs');
const path = require('path');

const resetPasswordConfirmationTemplate = () => {
    const commonStyle = fs.readFileSync(path.resolve(__dirname, './common.css'), 'utf8');
    const emailStyle = fs.readFileSync(path.resolve(__dirname, './resetPasswordConfirmation.css'), 'utf8');
    
    return (`
    <head>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200;0,300;0,400;0,500;0,600;1,200;1,300;1,400;1,500;1,600&display=swap" rel="stylesheet">
    </head>
    <body>
        <header>
            <img src='data:image/png;base64,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'/>
            <span>
                <h1>Froyo</h1>
                <h3>
                    The Minimalist
                    <br>
                    Social Network
                </h3>
            </span>
        </header>
        <p>
            Your password has successfully been changed.
        </p>
        <p>
            If you have any questions, please contact us at <a href='mailto: support@protosapps.com'>support@protosapps.com</a>
        </p>
    </body>
    <style>${emailStyle + commonStyle}</style>
    `);
};

module.exports = resetPasswordConfirmationTemplate;