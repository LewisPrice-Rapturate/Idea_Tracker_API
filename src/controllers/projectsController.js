import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectFilesById,
  addProjectFile,
  deleteProjectFile,
  getProjectFilesForDownload,
} from '../services/projectsService.js';

import archiver from 'archiver';
import { Buffer } from 'node:buffer';

export async function getAllProjectsHandler(req, res) {
  const {
    search = '',
    sortBy = 'date_created',
    order = 'desc',
    offset = '0',
    limit = '10',
  } = req.query;

  const options = {
    search,
    sortBy,
    order,
    offset: parseInt(offset),
    limit: parseInt(limit),
  };

  const projects = await getAllProjects(req.user.id, options);
  res.status(200).json(projects);
}

export async function getProjectByIdHandler(req, res) {
  const id = parseInt(req.params.id);
  const project = await getProjectById(id, req.user.id);
  res.status(200).json(project);
}

export async function createProjectHandler(req, res) {
  const { name, description } = req.body;
  const newProject = await createProject(req.user.id, { name, description });
  res.status(201).json(newProject);
}

export async function updateProjectHandler(req, res) {
  const id = parseInt(req.params.id);
  const { name, description } = req.body;
  const updatedProject = await updateProject(id, req.user.id, {
    name,
    description,
  });
  res.status(200).json(updatedProject);
}

export async function deleteProjectHandler(req, res) {
  const id = parseInt(req.params.id);
  await deleteProject(id, req.user.id);
  res.status(204).send();
}

export async function getProjectFilesHandler(req, res) {
  const id = parseInt(req.params.id);
  const files = await getProjectFilesById(id, req.user.id);
  res.status(200).json(files);
}

export async function addProjectFileHandler(req, res) {
  let id;
  let fileData;

  try {
    id = parseInt(req.params.id);
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    fileData = {
      name: req.file.originalname,
      file: req.file.buffer,
      size: req.file.size,
      mimeType: req.file.mimetype
    };
  } catch (error) {
    return res.status(400).json({ error: 'Invalid file data' });
  }

  try {
    const newFile = await addProjectFile(id, req.user.id, fileData);
    if (!newFile) {
      return res.status(404).json({ error: 'Project file error' });
    }
    const { file, ...metadata } = newFile;
    res.status(201).json(metadata);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export async function deleteProjectFileHandler(req, res) {
  try {
    const fileId = parseInt(req.params.id);
    
    const deletedFile = await deleteProjectFile(fileId, req.user.id);
    
    if (!deletedFile) {
      return res.status(404).json({ error: 'File not found or unauthorized' });
    }

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Invalid file ID' });
  }
}

export async function downloadProjectFilesHandler(req, res) {
  try {
    const fileId = parseInt(req.params.id);
    const userId = req.user.id;

    const files = await getProjectFilesForDownload(fileId, userId);

    if (!files || files.length === 0) {
      return res.status(404).json({ error: 'No files found for this project' });
    }

    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="project_${fileId}_files.zip"`
    });

    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.pipe(res);

    files.forEach(f => {
    
      const binaryData = f.file;

      if (binaryData) {
        const bufferData = Buffer.from(binaryData);
        archive.append(bufferData, { name: f.name });
      }
      else {
        console.error(`ERROR: No binary data found for ${f.name}. Object was:`, f);
      }
    });

    await archive.finalize();

  } catch (error) {
    if (!res.headersSent) {
      res.status(error.status || 500).json({ error: error.message });
    }
  }
}