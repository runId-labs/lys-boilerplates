import {PageTemplate} from "lys-front/types";
import "./styles.scss";

/**
 * Private page template
 * Simple template for private pages
 * Navbar and sidebar are provided by PrivateAppTemplate
 */
const PrivatePageTemplate: PageTemplate = ({route}) => {
    return (
        <div className="private-page-template">
            <route.component route={route}/>
        </div>
    );
};

export default PrivatePageTemplate;