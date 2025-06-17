import { AuthRequest } from "../middleware/authmiddleware";
import { Response } from "express";
import userContent from "../models/contentModel";

/*
 * Creates new content for the authenticated user.
 * - Validates required fields.
 * - Saves new content to the database.
 * @param req - Authenticated request containing user ID and content details.
 * @param res - Express response object.
 */
export const newContent = async (req: AuthRequest, res: Response) => {
  try {
    const { link, contentType, title, tag } = req.body;
    const userid = req.userID;

    // Validate required fields (tag is optional)
    if (!link || !contentType || !title || !userid) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    // Create and save new content
    const contentCreated = new userContent({
      link: link,
      contentType: contentType,
      title: title,
      tag: tag, // Optional
      userId: userid,
    });

    await contentCreated.save();
    res.status(200).json({
      message: "Content saved Successfully",
    });
    return;
  } catch (err) {
    console.log("Err(catch): something went wrong", err);
    res.status(500).json({ message: "Something went wrong" }); // Send error response
    return;
  }
};

/*
 * Retrieves all content for the authenticated user.
 * @param req - Authenticated request containing user ID.
 * @param res - Express response object.
 */
export const content = async (req: AuthRequest, res: Response) => {
  try {
    const userid = req.userID;

    // Validate user ID
    if (!userid) {
      res.status(400).json({ message: "Something wrong" });
      return;
    }

    // Find all content for the user
    const userData = await userContent.find({ userId: userid });
    res.status(200).json({
      message: "User data fetched successfully",
      data: userData,
    });
    console.log(userData);
  } catch (err) {
    console.log("Err(catch): something went wrong", err);
    res.status(500).json({ message: "Something went wrong" }); // Send error response
    return;
  }
};

/*
 * Deletes content for the authenticated user.
 * - Validates user ID and content ID.
 * - Checks if content exists and belongs to the user.
 * - Deletes the content.
 * @param req - Authenticated request containing user ID and content ID.
 * @param res - Express response object.
 */
export const deleteContent = async (req: AuthRequest, res: Response) => {
  try {
    const userid = req.userID;
    const userTitle = req.params.contentId;

    console.log("userid =>", userid);
    console.log("contentid =>", userTitle);

    // Validate user ID and content ID
    if (!userid || !userTitle) {
      res.status(400).json({ message: "User ID or Content ID missing" });
      return;
    }

    // Find the content by title and user ID
    const content = await userContent.findOne({ title: userTitle, userId: userid });

    if (!content) {
      res.status(404).json({ message: "Content not found or unauthorized" });
      return;
    }

    // Delete the content by its _id (not by the document object)
    // NOTE: `findByIdAndDelete` expects the _id, not the document object.
    // You should use: await userContent.findByIdAndDelete(content._id);
    await userContent.findByIdAndDelete(content._id);

    res.status(200).json({ message: "Content deleted successfully" });
    return;
  } catch (err) {
    console.log("Err(catch): something went wrong", err);
    res.status(500).json({ message: "Something went wrong" }); // Send error response
    return;
  }
};

/*
 * Shares all content for a specific user (by user ID).
 * @param req - Request containing user ID in params.
 * @param res - Express response object.
 */
export const shareContent = async (req: AuthRequest, res: Response) => {
  const { userId } = req.params;
  try {
    const documents = await userContent.find({ userId });
    res.status(200).json({ data: documents });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
