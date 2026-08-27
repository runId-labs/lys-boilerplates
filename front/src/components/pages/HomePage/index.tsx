import React from "react";
import {PageProps} from "lys-front/types";

const HomePage: React.FC<PageProps> = () => {
    return (
        <div className="d-flex flex-column align-items-center gap-4 mt-5">
            <h2>Welcome</h2>
            <p className="text-muted">Your application is running. Start building your pages.</p>
        </div>
    );
};

export default HomePage;
