import { CheckboxButton, CheckboxButtonWithDescription } from "../miscellaneous/Buttons";



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
                padding: "2rem",
                right: "0%",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
            }}>
                <div style={{
                }}>
                    <h1 style={{}}>Choose Your Destination</h1>
                </div>

                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.1rem",
                }}>
                    <CheckboxButtonWithDescription
                        description={"Show Fast Travel Locations"}
                    />
                    <CheckboxButtonWithDescription
                        description={"Show Habitable Zones"}
                    />
                </div>

                <div style={{
                    display: "flex",
                    flexDirection: "column",
                }}>
                    <div style={{
                        backgroundColor: "rgba(1,1,1,0)",
                        padding: "1rem",
                    }}>

                        <h1 style={{color : "black", margin : 0}}>Planets</h1>
                    </div>
                    <div style={{
                        backgroundColor: "rgba(1, 1, 1, 0.02)",
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                    }}>
                        <button style={{
                            borderBottom: "0.1rem solid rgba(196, 196, 196, 1)",
                            backgroundColor: "rgba(22, 22, 22, 1)",
                        textAlign: "left",
                        }}>
                            <a style={{color : "white", margin : 0}}>Kepler-22b</a>
                        </button>

                        <button style={{
                            borderBottom: "0.1rem solid rgba(196, 196, 196, 1)",
                            textAlign: "left",
                        }}>
                            <a style={{color : "black", margin : 0}}>Trappist-1e</a>
                        </button>

                        <button style={{
                            borderBottom: "0.1rem solid rgba(196, 196, 196, 1)",
                            textAlign: "left",
                        }}>
                            <a style={{color : "black", margin : 0}}>Mars</a>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WelcomeWindow;
