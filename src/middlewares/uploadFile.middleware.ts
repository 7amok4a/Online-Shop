import multer from "multer";

const store = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images");
    },
    filename: (req, file, cb) => {
        const safeName = file.originalname.replace(/\s+/g, '_') ;  
        cb(null , Date.now() + "_" + safeName) ; 
    }

})


const upload = multer({ dest: "images", storage: store }); 


export default upload ; 