import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";

// Serve index.html as static
const bucket = new gcp.storage.Bucket("bucket-test", {
  location: "US",
  uniformBucketLevelAccess: true,
  website: {
    mainPageSuffix: "index.html",
  },
});

// Export DNS name
export const bucketName = bucket.url

const bucketObject = new gcp.storage.BucketObject("index.html", {
  bucket: bucket.name,
  source: new pulumi.asset.FileAsset("index.html"),
});

const bucketBinding = new gcp.storage.BucketIAMBinding("bucket-binding", {
  bucket: bucket.name,
  role: "roles/storage.objectViewer",
  members: ["allUsers"],
});

export const bucketEndpoint = pulumi.concat("http://storage.googleapis.com/", bucket.name, "/", bucketObject.name);