import { useEffect, useState } from 'react';
import { api, API_URL, getMediaUrl } from '../../lib/api';
import { Trash2, Plus, Upload, Image as ImageIcon, Film, Edit } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  before_image_url: string;
  after_image_url: string;
  before_video_url?: string;
  after_video_url?: string;
  media_type: string;
  created_at: string;
}

export default function BeforeAfterManagement() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    before_image_url: '',
    after_image_url: '',
    before_video_url: '',
    after_video_url: '',
    media_type: 'image',
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await api.projects.getAll();

      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const uploadFile = async (file: File, fieldName: string): Promise<string> => {
    const bucket = 'before-after';
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;
    const filePath = `${fieldName}/${fileName}`;

    try {
      const { data, error: uploadError } = await api.storage.upload(bucket, file, filePath);

      if (uploadError) throw new Error(uploadError.message);

      return data?.path || '';
    } catch (err) {
      throw err;
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const url = await uploadFile(file, fieldName);
      setFormData((prev) => ({ ...prev, [fieldName]: url }));
    } catch (err) {
      setError(`Failed to upload ${fieldName}: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      before_image_url: '',
      after_image_url: '',
      before_video_url: '',
      after_video_url: '',
      media_type: 'image',
    });
    setEditingId(null);
    setError('');
    setShowForm(false);
  };

  const handleEdit = (project: Project) => {
    setFormData({
      title: project.title,
      description: project.description || '',
      before_image_url: project.before_image_url || '',
      after_image_url: project.after_image_url || '',
      before_video_url: project.before_video_url || '',
      after_video_url: project.after_video_url || '',
      media_type: project.media_type,
    });
    setEditingId(project.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setUploading(true);

    if (!formData.title) {
      setError('Please fill in project title');
      setUploading(false);
      return;
    }

    const isImageProject = formData.media_type === 'image' || formData.media_type === 'both';
    const isVideoProject = formData.media_type === 'video' || formData.media_type === 'both';

    if (isImageProject && (!formData.before_image_url || !formData.after_image_url)) {
      setError('Please upload both before and after images');
      setUploading(false);
      return;
    }

    if (isVideoProject && (!formData.before_video_url || !formData.after_video_url)) {
      setError('Please upload both before and after videos');
      setUploading(false);
      return;
    }

    try {
      if (editingId) {
        const { error: updateError } = await api.projects.update(editingId, {
          id: editingId,
          title: formData.title,
          description: formData.description,
          before_image_url: formData.before_image_url || undefined,
          after_image_url: formData.after_image_url || undefined,
          before_video_url: formData.before_video_url || undefined,
          after_video_url: formData.after_video_url || undefined,
          media_type: formData.media_type,
        });

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await api.projects.create({
          title: formData.title,
          description: formData.description,
          before_image_url: formData.before_image_url || undefined,
          after_image_url: formData.after_image_url || undefined,
          before_video_url: formData.before_video_url || undefined,
          after_video_url: formData.after_video_url || undefined,
          media_type: formData.media_type,
        });

        if (insertError) throw insertError;
      }

      resetForm();
      fetchProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save project');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const { error } = await api.projects.delete(id);

      if (error) throw error;
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Before & After Gallery</h1>
          <p className="text-gray-600">Manage your project showcase</p>
        </div>
        <button
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setShowForm(true);
            }
          }}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <Plus size={20} />
          {showForm ? 'Cancel' : 'Add Project'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {editingId ? 'Edit Project' : 'Create New Project'}
          </h2>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Project Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Garden Renovation"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the project..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Media Type</label>
              <select
                name="media_type"
                value={formData.media_type}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none"
              >
                <option value="image">Images Only</option>
                <option value="video">Videos Only</option>
                <option value="both">Both Images & Videos</option>
              </select>
            </div>

            {(formData.media_type === 'image' || formData.media_type === 'both') && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <ImageIcon size={20} />
                  Image Files
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Before Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'before_image_url')}
                      disabled={uploading}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none disabled:bg-gray-100"
                    />
                    {formData.before_image_url && (
                      <img src={getMediaUrl(formData.before_image_url)} alt="Before" className="mt-2 h-32 w-full object-cover rounded-lg" />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">After Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'after_image_url')}
                      disabled={uploading}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none disabled:bg-gray-100"
                    />
                    {formData.after_image_url && (
                      <img src={getMediaUrl(formData.after_image_url)} alt="After" className="mt-2 h-32 w-full object-cover rounded-lg" />
                    )}
                  </div>
                </div>
              </div>
            )}

            {(formData.media_type === 'video' || formData.media_type === 'both') && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <Film size={20} />
                  Video Files
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Before Video</label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleFileChange(e, 'before_video_url')}
                      disabled={uploading}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none disabled:bg-gray-100"
                    />
                    {formData.before_video_url && (
                      <video src={getMediaUrl(formData.before_video_url)} className="mt-2 h-32 w-full object-cover rounded-lg" controls />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">After Video</label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleFileChange(e, 'after_video_url')}
                      disabled={uploading}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none disabled:bg-gray-100"
                    />
                    {formData.after_video_url && (
                      <video src={getMediaUrl(formData.after_video_url)} className="mt-2 h-32 w-full object-cover rounded-lg" controls />
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={uploading}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <Upload size={20} />
                {uploading ? 'Processing...' : (editingId ? 'Save Changes' : 'Create Project')}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-lg transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600">No projects yet. Create your first one!</p>
          </div>
        ) : (
          projects.map((project) => {
            const isVideo = project.media_type === 'video' || project.media_type === 'both';

            return (
              <div key={project.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
                <div className="aspect-square bg-black relative overflow-hidden group">
                  {isVideo ? (
                    <>
                      <video
                        src={getMediaUrl(project.before_video_url)}
                        className="w-full h-full object-contain transition-opacity group-hover:opacity-50"
                      />
                      <video
                        src={getMediaUrl(project.after_video_url)}
                        className="absolute inset-0 w-full h-full object-contain opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </>
                  ) : (
                    <>
                      {/* Before Image with Blur Background */}
                      <div className="w-full h-full transition-opacity group-hover:opacity-0 duration-300">
                        <img
                          src={getMediaUrl(project.before_image_url)}
                          alt=""
                          className="absolute inset-0 w-full h-full object-cover blur-md opacity-35 scale-105"
                        />
                        <img
                          src={getMediaUrl(project.before_image_url)}
                          alt="Before"
                          className="absolute inset-0 w-full h-full object-contain z-10"
                        />
                      </div>
                      {/* After Image with Blur Background */}
                      <div className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <img
                          src={getMediaUrl(project.after_image_url)}
                          alt=""
                          className="absolute inset-0 w-full h-full object-cover blur-md opacity-35 scale-105"
                        />
                        <img
                          src={getMediaUrl(project.after_image_url)}
                          alt="After"
                          className="absolute inset-0 w-full h-full object-contain z-10"
                        />
                      </div>
                    </>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white text-sm font-semibold">Hover to see after</p>
                  </div>
                  {isVideo && (
                    <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 z-20">
                      <Film size={12} />
                      Video
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{project.title}</h3>
                  {project.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(project)}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold py-2 rounded-lg transition-colors text-sm"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2 rounded-lg transition-colors text-sm"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
