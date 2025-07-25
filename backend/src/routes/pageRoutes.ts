import  {Router}  from "express";
import { registeration,login} from "../controllers/authControllers";
import { newContent,content,deleteContent, shareContent } from "../controllers/crudController";
import { isAuthenticated } from "../middleware/authmiddleware";

const router = Router();

router.get("/content", isAuthenticated , content)
router.post("/signup",registeration)
router.post("/signin",login)
router.post("/addcontent",isAuthenticated,newContent)
router.delete("/delete/:contentId",isAuthenticated,deleteContent)
router.get("/share/:userId",isAuthenticated,shareContent)

export default router;
