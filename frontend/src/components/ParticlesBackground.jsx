import Particles from "react-tsparticles";

const ParticlesBackground = ({ mood }) => {

  const getColor = () => {
    switch (mood) {
      case "happy":
        return "#FFD93D";

      case "sad":
        return "#4D96FF";

      case "angry":
        return "#FF4C4C";

      default:
        return "#9D4EDD";
    }
  };

  return (
    <Particles
      params={{
        background: {
          color: {
            value: "transparent",
          },
        },

        fpsLimit: 60,

        particles: {
          number: {
            value: 60,
          },

          color: {
            value: getColor(),
          },

          links: {
            enable: true,
            color: getColor(),
            distance: 150,
            opacity: 0.4,
          },

          move: {
            enable: true,
            speed: 2,
          },

          size: {
            value: 3,
          },

          opacity: {
            value: 0.5,
          },
        },

        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "repulse",
            },
          },

          modes: {
            repulse: {
              distance: 120,
            },
          },
        },
      }}
    />
  );
};

export default ParticlesBackground;