//dependecies
const fs = require("fs");
const path = require("path");
const { parseJsonToObject } = require("../utils/parseJSON");

//module scaffolding
const data = {};

//base directory of data folder
data.baseDir = path.join(__dirname, "/../.data");

//write data to file
// dir means which subfolder to write the data to
// file is the name of the file to write to
// data is the data to write to the file
// callback is the function to call when the operation is complete
data.create = (dir, file, data, callback) => {
  const baseDir = path.join(__dirname, "/../.data");
  //at first check if the user already exists
  fs.readFile(
    baseDir + "/" + dir + "/" + file + ".json",
    "utf8",
    (err, JSONusers) => {
      if (
        !err &&
        JSONusers &&
        Array.isArray(JSON.parse(JSONusers)) &&
        JSON.parse(JSONusers).length >= 0
      ) {
        let parsedData = JSON.parse(JSONusers);
        if (parsedData.find((d) => d._id === data._id)) {
          callback("Data already exists");
        } else {
          parsedData.push(data);
          fs.open(
            baseDir + "/" + dir + "/" + file + ".json",
            "r+",
            (err1, fileDescriptor) => {
              if (!err1 && fileDescriptor) {
                fs.ftruncate(fileDescriptor, (err2) => {
                  if (!err2) {
                    fs.writeFile(
                      fileDescriptor,
                      JSON.stringify(parsedData),
                      (err3) => {
                        if (!err3) {
                          fs.close(fileDescriptor, (err4) => {
                            if (!err4) {
                              callback(false);
                            } else {
                              callback("Error closing existing file");
                            }
                          });
                        } else {
                          callback("Error writing to existing file");
                        }
                      }
                    );
                  } else {
                    callback("Error truncating file");
                  }
                });
              } else {
                callback(
                  "Could not open file for updating, it may not exist yet"
                );
              }
            }
          );
        }
      } else {
        fs.open(
          baseDir + "/" + dir + "/" + file + ".json",
          "r+",
          (err1, fileDescriptor) => {
            if (!err1 && fileDescriptor) {
              fs.ftruncate(fileDescriptor, (err2) => {
                if (!err2) {
                  const firstData = [data];
                  fs.writeFile(
                    fileDescriptor,
                    JSON.stringify(firstData),
                    (err3) => {
                      if (!err3) {
                        fs.close(fileDescriptor, (err4) => {
                          if (!err4) {
                            callback(false);
                          } else {
                            callback("Error closing existing file");
                          }
                        });
                      } else {
                        callback("Error writing to existing file");
                      }
                    }
                  );
                } else {
                  callback("Error truncating file");
                }
              });
            } else {
              callback(
                "Could not open file for updating, it may not exist yet"
              );
            }
          }
        );
      }
    }
  );
};

//read data from file
// dir is the subfolder to read the data from
// file is the name of the file to read from
// callback is the function to call when the operation is complete
data.read = (dir, file, callback) => {
  const baseDir = path.join(__dirname, "/../.data");
  fs.readFile(
    baseDir + "/" + dir + "/" + file + ".json",
    "utf8",
    (err, data) => {
      if (!err && data) {
        const parsedData = parseJsonToObject(data);
        callback(false, parsedData);
      } else {
        callback(err, data);
      }
    }
  );
};

//update data in file
// dir is the subfolder to read the data from
// file is the name of the file to read from
// data is the data to update the file with
// callback is the function to call when the operation is complete
data.update = (dir, file, data, callback) => {
  const baseDir = path.join(__dirname, "/../.data");
  fs.open(
    baseDir + "/" + dir + "/" + file + ".json",
    "r+",
    (err1, fileDescriptor) => {
      if (!err1 && fileDescriptor) {
        fs.ftruncate(fileDescriptor, (err2) => {
          if (!err2) {
            fs.writeFile(fileDescriptor, JSON.stringify(data), (err3) => {
              if (!err3) {
                fs.close(fileDescriptor, (err4) => {
                  if (!err4) {
                    callback(false);
                  } else {
                    callback("Error closing existing file");
                  }
                });
              } else {
                callback("Error writing to existing file");
              }
            });
          } else {
            callback("Error truncating file");
          }
        });
      } else {
        callback("Could not open file for updating, it may not exist yet");
      }
    }
  );
};

//delete data from file
// dir is the subfolder to read the data from
// file is the name of the file to read from
// callback is the function to call when the operation is complete
data.delete = (dir, file, callback) => {
  const baseDir = path.join(__dirname, "/../.data");
  fs.unlink(baseDir + "/" + dir + "/" + file + ".json", (err) => {
    if (!err) {
      callback(false);
    } else {
      callback("Error deleting file");
    }
  });
};



//export module
module.exports = data;