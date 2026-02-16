export const slideUp = {
    hidden: { y: "100%", opacity: 0 },
    visible: {
        y: "0%",
        opacity: 1,
        transition: { type: "spring", damping: 25, stiffness: 500 }
    },
    exit: { y: "100%", opacity: 0 }
};

export const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
};
