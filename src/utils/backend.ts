import { Pathway } from 'pathways-model';
import axios, { AxiosResponse } from 'axios';
import config from './ConfigManager';
import { Criteria } from 'criteria-model';

const baseUrl = config.get('pathwaysBackend');

export function deletePathway(id: string): Promise<AxiosResponse<string>> {
  return axios.delete<string>(`${baseUrl}/pathway/${id}`);
}

export function updatePathway(pathway: Pathway): Promise<AxiosResponse<Pathway>> {
  return axios.put<Pathway>(`${baseUrl}/pathway/${pathway.id}`, pathway);
}

export function deleteCriteria(id: string): Promise<AxiosResponse<string>> {
  return axios.delete<string>(`${baseUrl}/criteria/${id}`);
}

export function updateCriteria(criteria: Criteria): Promise<AxiosResponse<Criteria>> {
  return axios.put<Criteria>(`${baseUrl}/criteria/${criteria.id}`, criteria);
}

export function readFile(file: File, callback: (event: ProgressEvent<FileReader>) => void): void {
  const reader = new FileReader();
  reader.onload = callback;
  reader.readAsText(file);
}
