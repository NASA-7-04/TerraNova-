import { CheckboxButton } from "../miscellaneous/Buttons";



const WelcomeWindow = () => {

    return (
        <div style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            height: "100%",
            width: "100%",
            position: "fixed",

        }}>
            <div style={{
                backgroundColor: "rgba(255, 255, 255, 1)",
                color: "rgba(0,0,0,1)",
                height: "100%",
                width: "25%",
                position: "fixed",
                minWidth: "360px",
                maxWidth: "480px",
                padding: "1rem",
                right: "0%",
                gap: "1em",
            }}>
                <div style={{
                }}>
                    <h1 style={{
                    }}>Choose Your Destination</h1>
                </div>

                <div style={{
                }}>
                    <div>
                        <CheckboxButton /> <span>Show Fast Travel Locations</span>
                    </div>
                    <div>
                        <CheckboxButton /> <span>Show Habitable Zones</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WelcomeWindow;
