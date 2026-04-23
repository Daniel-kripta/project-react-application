import videoFondo from "../../assets/hero-video/hero-nutridayly.mp4";

export default function Hero() {
    return (
        <section className="hero-section">
            <video 
                src={videoFondo} 
                autoPlay
                muted
                playsInline
                onContextMenu={(e) => e.preventDefault()}
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover", 
                }}
            />
        </section>
    );
}