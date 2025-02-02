import 'react';
import './Public.scss';

const Public = () => {
    return (
        <div className="public-container">
            <div className="error-message">
                <h1>Ошибка входа</h1>
                <p>Пожалуйста, проверьте правильность введенных данных или обратитесь в службу поддержки.</p>
            </div>
        </div>
    );
};

export default Public;