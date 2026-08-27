import {PageTemplate} from "lys-front/types";

/**
 * Default page template
 * Renders the route component with padding and full height
 */
const EmptyPageTemplate: PageTemplate = (
    {
        route
    }) => {

    return(
        <div className="p-5 h-100">
            <route.component route={route}/>
        </div>

    );
};

export default EmptyPageTemplate;