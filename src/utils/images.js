import { Platform } from 'react-native';
import Meteor from 'react-native-meteor';
import RNFetchBlob from 'react-native-fetch-blob';

const FILES_URL = 'http://35.178.38.67/cdn/storage';

export const getImageUrl = (imageId) => {
  const image = Meteor.collection('images').findOne({ _id: imageId });
  // return image ? `http://localhost:3000/cdn/storage/images/${imageId}/original/${imageId}.${image.ext}` : '';
  return image ? `${FILES_URL}/images/${imageId}/original/${imageId}.${image.ext}` : '';
};

export const unlinkCachedImage = () => {
  RNFetchBlob.fs.unlink(`${Platform.OS === 'ios' ? RNFetchBlob.fs.dirs.DocumentDir : RNFetchBlob.fs.dirs.DownloadDir}/Rolzo/`);
};

const saveImageToDisk = (url, path) => {
  return RNFetchBlob
    .config({ path })
    .fetch('GET', url, {})
    .then(() => {
      return true;
    }, (error) => {
      return error;
    });
};

const downloadImage = (url, path) => {
  return RNFetchBlob.fs.exists(path).then((exists) => {
    if (exists) {
      return true;
    }
    return saveImageToDisk(url, path);
  });
};

export const saveImage2Cache = (imageId) => {
  const image = Meteor.collection('images').findOne({ _id: imageId });
  const url = image ? `${FILES_URL}/images/${imageId}/original/${imageId}.${image ? image.ext : 'png'}` : '';
  const path = `${Platform.OS === 'ios' ? RNFetchBlob.fs.dirs.DocumentDir : RNFetchBlob.fs.dirs.DownloadDir}/Rolzo/${imageId}.${image ? image.ext : 'png'}`;
  return downloadImage(url, path);
};

export const getImageUrlFromCache = (imageId) => {
  const image = Meteor.collection('images').findOne({ _id: imageId });
  return `file://${Platform.OS === 'ios' ? RNFetchBlob.fs.dirs.DocumentDir : RNFetchBlob.fs.dirs.DownloadDir}/Rolzo/${imageId}.${image ? image.ext : 'png'}`;
};

export const getDocumentUrl = (documentId) => {
  const document = Meteor.collection('documents').findOne({ _id: documentId });
  // return image ? `http://localhost:3000/cdn/storage/documents/${imageId}/original/${imageId}.${document.ext}` : '';
  return document ? `${FILES_URL}/documents/${documentId}/original/${documentId}.${document.ext}` : '';
};
