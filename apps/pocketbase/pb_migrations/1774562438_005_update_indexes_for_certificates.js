/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("certificates");
  collection.indexes.push("CREATE UNIQUE INDEX idx_certificates_certificate_code ON certificates (certificate_code)");
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("certificates");
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_certificates_certificate_code"));
  return app.save(collection);
})