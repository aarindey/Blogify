const express = require("express");

const app = express();
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const dotenv = require("dotenv");
dotenv.config();
const multer = require("multer");
const sharp = require("sharp");
const cors = require("cors");

const bucketName = process.env.BUCKET_NAME;
const region = process.env.BUCKET_REGION;
const accessKeyId = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;
const endpoint = `https://${process.env.ACCOUNT_ID}.r2.cloudflarestorage.com`;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const s3Client = new S3Client({
  region,
  endpoint,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

// const generateFileName = (bytes = 32) =>
//   crypto.randomBytes(bytes).toString("hex");

app.use(cors());
app.post("/api/v1/imgUpload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, error: "No file uploaded" });
    }

    const file = req.file;
    const fileBuffer = await sharp(file.buffer)
      .resize({ height: 1080, width: 1920, fit: "contain" })
      .toBuffer();

    // Configure the upload details to send to S3
    const fileName = req.query.imageName;
    if (!fileName) {
      return res
        .status(400)
        .json({ success: false, error: "Image name is missing" });
    }

    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: fileName,
      Body: fileBuffer,
      ContentType: file.mimetype,
    };

    // Send the upload to S3
    await s3Client.send(new PutObjectCommand(params));

    res.json({
      success: true,
      fileName: fileName,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

app.get("/api/v1/blogImg", async (req, res) => {
  const fileName = req.query.imageName;
  const imageUrl = await getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: bucketName,
      Key: fileName,
    }),
    { expiresIn: 500 }
  );

  return res.json({ imageUrl: imageUrl });
});

app.delete("/api/v1/deleteImg", async (req, res) => {
  const fileName = req.query.imageName;
  const deleteParams = {
    Bucket: bucketName,
    Key: fileName,
  };

  await s3Client.send(new DeleteObjectCommand(deleteParams));

  return res.json({
    success: true,
  });
});

app.listen(3001, () => {
  console.log("App is listening at port 3001");
});
