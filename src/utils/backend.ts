import { Pathway } from 'pathways-model';
import axios from 'axios';
import config from './ConfigManager';

const baseUrl = config.get('pathwaysBackend');

export function postNewPathway(pathway: Pathway): Promise<any> {
  return axios.post(`${baseUrl}/pathway/`, pathway);
}

export function deletePathway(id: String): Promise<any> {
  return axios.delete(`${baseUrl}/pathway/${id}`);
}

export function readFile(file: File, callback: (event: ProgressEvent<FileReader>) => any): void {
  const reader = new FileReader();
  reader.onload = callback;
  reader.readAsText(file);
}
