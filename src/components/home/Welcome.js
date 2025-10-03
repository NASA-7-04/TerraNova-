


const WelcomeWindow = () => {
  
    return (
        <div style = {{
            backgroundColor : "rgba(0,0,0,0.5)",
            height : "100%",
            width : "100%",
            position : "fixed",
            
        }}>
            <div style = {{
                backgroundColor : "rgba(255, 255, 255, 1)",
                color : "rgba(0,0,0,1)",
                height : "100%",
                width: "20%",
                position : "fixed",
                minWidth : "300px",
                maxWidth : "400px",
                padding : "1rem",
                right : "0%"
            }}>
               <div style = {{
                backgroundColor : "rgba(0, 0, 0, 0)",
            }}>
                <h1 style = {{
                }}>Choose Your Destination</h1>
               </div>
            </div>
        </div>
    )
}

export default WelcomeWindow;
