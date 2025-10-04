
export const WhiteFrameOnRight = ({name, description, children}) => {

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
            {children}
            </div>
        </div>
    )
}

