import { Pathway } from 'pathways-model';
import axios from 'axios';
import config from './ConfigManager';
import { Criteria } from 'criteria-model';

const baseUrl = config.get('pathwaysBackend');

export function deletePathway(id: string): Promise<any> {
  return axios.delete(`${baseUrl}/pathway/${id}`);
}

export function updatePathway(pathway: Pathway): Promise<any> {
  return axios.put(`${baseUrl}/pathway/${pathway.id}`, pathway);
}

export function deleteCriteria(id: string): Promise<any> {
  return axios.delete(`${baseUrl}/criteria/${id}`);
}

export function updateCriteria(criteria: Criteria): Promise<any> {
  return axios.put(`${baseUrl}/criteria/${criteria.id}`, criteria);
}

export function readFile(file: File, callback: (event: ProgressEvent<FileReader>) => any): void {
  const reader = new FileReader();
  reader.onload = callback;
  reader.readAsText(file);
}
