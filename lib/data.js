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
    (err, JSONdatas) => {
      if (
        !err &&
        JSONdatas &&
        Array.isArray(JSON.parse(JSONdatas)) &&
        JSON.parse(JSONdatas).length >= 0
      ) {
        let parsedData = JSON.parse(JSONdatas);
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
  fs.readFile(
    baseDir + "/" + dir + "/" + file + ".json",
    "utf8",
    (err, JSONdatas) => {
      if (
        !err &&
        JSONdatas &&
        Array.isArray(JSON.parse(JSONdatas)) &&
        JSON.parse(JSONdatas).length >= 0
      ) {
        let parsedData = JSON.parse(JSONdatas);
        if (parsedData.find((d) => d._id === data._id)) {
          parsedData = parsedData.map((d) => {
            if (d._id === data._id) {
              return data;
            } else {
              return d;
            }
          });
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
        } else {
          callback("Data does not exist");
        }
      } else {
        callback("Could not find the file, it may not exist yet");
      }
    }
  );
};

data.bulkUpdate = (dir, file, dataArray, callback) => {
  const baseDir = path.join(__dirname, "/../.data");
  //check if the ids in the data array are unique
  const ids = dataArray.map((d) => d._id);
  const uniqueIds = [...new Set(ids)];
  if (ids.length !== uniqueIds.length) {
    callback("Ids must be unique");
  } else {
    fs.readFile(
      baseDir + "/" + dir + "/" + file + ".json",
      "utf8",
      (err, JSONdatas) => {
        if (
          !err &&
          JSONdatas &&
          Array.isArray(JSON.parse(JSONdatas)) &&
          JSON.parse(JSONdatas).length >= 0
        ) {
          let parsedData = JSON.parse(JSONdatas);
          parsedData = parsedData.map((d) => {
            const data = dataArray.find((data) => data._id === d._id);
            if (data) {
              return {
                ...d,
                ...data,
              };
            }
            return d;
          });
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
              }
            }
          );
        } else {
          callback("Could not find the file, it may not exist yet");
        }
      }
    );
  }
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
