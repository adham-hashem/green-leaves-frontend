import { useEffect, useState } from 'react';
import { api, API_URL, getMediaUrl } from '../lib/api';
import { Play, Pause, ArrowLeft, Image, Film, Grid3x3, LayoutGrid, Leaf, X, ArrowRight, Maximize2 } from 'lucide-react';

import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

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

interface ComparisonState {
  projectId: string;
  sliderPosition: number;
}

export default function BeforeAfterPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [comparisons, setComparisons] = useState<Map<string, ComparisonState>>(new Map());
  const [playingVideos, setPlayingVideos] = useState<Set<string>>(new Set());
  const [filterType, setFilterType] = useState<string>('all');
  const [gridSize, setGridSize] = useState<'large' | 'small'>('large');

  const [activeLightboxProject, setActiveLightboxProject] = useState<Project | null>(null);
  const [lightboxTab, setLightboxTab] = useState<'before' | 'after'>('after');

  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 6;

  const handlePrevProject = () => {
    if (!activeLightboxProject) return;
    const currentIndex = filteredProjects.findIndex((p) => p.id === activeLightboxProject.id);
    const prevIndex = (currentIndex - 1 + filteredProjects.length) % filteredProjects.length;
    setActiveLightboxProject(filteredProjects[prevIndex]);
  };

  const handleNextProject = () => {
    if (!activeLightboxProject) return;
    const currentIndex = filteredProjects.findIndex((p) => p.id === activeLightboxProject.id);
    const nextIndex = (currentIndex + 1) % filteredProjects.length;
    setActiveLightboxProject(filteredProjects[nextIndex]);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filterType]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await api.projects.getAll();

      if (error) throw error;

      const projectsData = data || [];
      setProjects(projectsData);

      const initialComparisons = new Map();
      projectsData.forEach((project) => {
        initialComparisons.set(project.id, { projectId: project.id, sliderPosition: 50 });
      });
      setComparisons(initialComparisons);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSliderChange = (projectId: string, position: number) => {
    const newComparisons = new Map(comparisons);
    const current = newComparisons.get(projectId) || { projectId, sliderPosition: 50 };
    newComparisons.set(projectId, { ...current, sliderPosition: position });
    setComparisons(newComparisons);
  };

  const toggleVideoPlayback = (projectId: string) => {
    const newPlaying = new Set(playingVideos);
    if (newPlaying.has(projectId)) {
      newPlaying.delete(projectId);
    } else {
      newPlaying.add(projectId);
    }
    setPlayingVideos(newPlaying);
  };

  const filteredProjects = filterType === 'all'
    ? projects
    : projects.filter((p) => {
        if (filterType === 'images') return p.media_type === 'image' || p.media_type === 'both';
        if (filterType === 'videos') return p.media_type === 'video' || p.media_type === 'both';
        return true;
      });

  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

  const stats = {
    total: projects.length,
    images: projects.filter((p) => p.media_type === 'image' || p.media_type === 'both').length,
    videos: projects.filter((p) => p.media_type === 'video' || p.media_type === 'both').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header activeSection="gallery" />
      <main className="flex-1">
        {/* Custom Hero Section for Gallery */}
        <div className="bg-gradient-to-br from-green-800 via-green-700 to-green-600 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-400 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-400 rounded-full translate-x-1/2 translate-y-1/2"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Leaf className="w-12 h-12 text-yellow-400" />
                <h1 className="text-5xl lg:text-7xl font-bold">Our Projects</h1>
              </div>

              <p className="text-xl lg:text-2xl text-green-100 max-w-3xl mx-auto mb-10 leading-relaxed">
                Discover the stunning transformations we've created for our clients.
                From complete garden renovations to subtle improvements, see the difference
                professional landscaping makes.
              </p>

              {/* Stats Cards */}
              <div className="flex flex-wrap justify-center gap-4 lg:gap-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20">
                  <p className="text-3xl lg:text-4xl font-bold text-yellow-400">{stats.total}</p>
                  <p className="text-green-100 text-sm lg:text-base">Total Projects</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20">
                  <p className="text-3xl lg:text-4xl font-bold text-yellow-400">{stats.images}</p>
                  <p className="text-green-100 text-sm lg:text-base">Photo Galleries</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20">
                  <p className="text-3xl lg:text-4xl font-bold text-yellow-400">{stats.videos}</p>
                  <p className="text-green-100 text-sm lg:text-base">Video Tours</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="bg-gradient-to-b from-gray-50 to-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Filter and Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-12">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                    filterType === 'all'
                      ? 'bg-green-600 text-white shadow-lg shadow-green-600/30'
                      : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
                  }`}
                >
                  <Grid3x3 size={18} />
                  All Projects
                </button>
                <button
                  onClick={() => setFilterType('images')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                    filterType === 'images'
                      ? 'bg-green-600 text-white shadow-lg shadow-green-600/30'
                      : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
                  }`}
                >
                  <Image size={18} />
                  Images
                </button>
                <button
                  onClick={() => setFilterType('videos')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                    filterType === 'videos'
                      ? 'bg-green-600 text-white shadow-lg shadow-green-600/30'
                      : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
                  }`}
                >
                  <Film size={18} />
                  Videos
                </button>
              </div>

              <div className="flex items-center gap-2 bg-white rounded-xl p-1 shadow">
                <button
                  onClick={() => setGridSize('large')}
                  className={`p-2 rounded-lg transition-colors ${
                    gridSize === 'large' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title="Large Cards"
                >
                  <LayoutGrid size={20} />
                </button>
                <button
                  onClick={() => setGridSize('small')}
                  className={`p-2 rounded-lg transition-colors ${
                    gridSize === 'small' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title="Small Cards"
                >
                  <Grid3x3 size={20} />
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-white rounded-2xl p-6 shadow-md mb-12 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Leaf className="text-green-600" size={20} />
                How to Use the Comparison Slider
              </h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <div className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold">1</div>
                  <p><strong>Desktop:</strong> Click and drag the slider left or right to compare images</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold">2</div>
                  <p><strong>Mobile:</strong> Touch and slide your finger to adjust the comparison</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold">3</div>
                  <p><strong>Videos:</strong> Click play button to watch side-by-side comparisons</p>
                </div>
              </div>
            </div>

            {/* Projects Grid */}
            {filteredProjects.length === 0 ? (
              <div className="text-center py-16">
                <div className="max-w-4xl mx-auto">
                  {/* Professional Placeholder */}
                  <div className="bg-gradient-to-br from-green-50 via-white to-yellow-50 rounded-3xl shadow-xl p-16 border-2 border-green-100">
                    <div className="max-w-md mx-auto">
                      {/* Animated Icon */}
                      <div className="relative mb-8">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-32 h-32 bg-green-100 rounded-full animate-pulse"></div>
                        </div>
                        <div className="relative flex items-center justify-center">
                          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-full p-6 shadow-lg">
                            <Leaf className="w-16 h-16 text-white" />
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
                        Our Gallery is Growing
                      </h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        We're busy creating beautiful transformations! New project showcases will be added here soon. Check back later to see our latest work.
                      </p>

                      {/* Features Preview */}
                      <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                          <Image className="w-8 h-8 text-green-600 mx-auto mb-2" />
                          <p className="text-xs text-gray-600 font-medium">Photo Comparisons</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                          <Film className="w-8 h-8 text-green-600 mx-auto mb-2" />
                          <p className="text-xs text-gray-600 font-medium">Video Tours</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                          <Leaf className="w-8 h-8 text-green-600 mx-auto mb-2" />
                          <p className="text-xs text-gray-600 font-medium">Garden Projects</p>
                        </div>
                      </div>

                      {/* CTA Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                          to="/"
                          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl transition-all inline-flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                        >
                          <ArrowLeft size={20} />
                          Return Home
                        </Link>
                        <Link
                          to="/#booking"
                          className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-8 rounded-xl transition-all inline-flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                        >
                          Book a Consultation
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="mt-8 flex items-center justify-center gap-8 text-gray-400">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-200 rounded-full"></div>
                      <span className="text-sm">Professional Landscaping</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-200 rounded-full"></div>
                      <span className="text-sm">Garden Design</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-200 rounded-full"></div>
                      <span className="text-sm">Complete Transformations</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`grid gap-8 ${
                gridSize === 'large'
                  ? 'grid-cols-1 lg:grid-cols-2'
                  : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              }`}>
                {currentProjects.map((project, index) => {
                  const comparison = comparisons.get(project.id);
                  const sliderPos = comparison?.sliderPosition || 50;
                  const isVideoProject = project.media_type === 'video' || project.media_type === 'both';
                  const isImageProject = project.media_type === 'image' || project.media_type === 'both';
                  const isPlaying = playingVideos.has(project.id);

                  return (
                    <div
                      key={project.id}
                      className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                    >
                      {/* Media Container */}
                      <div className="relative overflow-hidden bg-black">
                        {isImageProject && (
                          <div className="relative w-full aspect-[4/3] overflow-hidden">
                            {/* Before Image with Blur Background */}
                            <div className="absolute inset-0 w-full h-full">
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

                            {/* After Image with Slider */}
                            <div
                              className="absolute inset-0 overflow-hidden transition-all duration-75 z-20"
                              style={{ width: `${sliderPos}%` }}
                            >
                              <div className="absolute inset-0 w-full h-full bg-black" style={{ width: `${(100 / (sliderPos || 1)) * 100}%`, maxWidth: 'none' }}>
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
                            </div>

                            {/* Slider */}
                            <div
                              className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl cursor-col-resize z-30"
                              style={{ left: `${sliderPos}%` }}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                const container = e.currentTarget.parentElement;
                                if (!container) return;

                                const handleMouseMove = (moveEvent: MouseEvent) => {
                                  const rect = container.getBoundingClientRect();
                                  const newPos = Math.max(0, Math.min(100, ((moveEvent.clientX - rect.left) / rect.width) * 100));
                                  handleSliderChange(project.id, newPos);
                                };

                                const handleMouseUp = () => {
                                  document.removeEventListener('mousemove', handleMouseMove);
                                  document.removeEventListener('mouseup', handleMouseUp);
                                };

                                document.addEventListener('mousemove', handleMouseMove);
                                document.addEventListener('mouseup', handleMouseUp);
                              }}
                              onTouchStart={(e) => {
                                const container = e.currentTarget.parentElement;
                                if (!container) return;

                                const handleTouchMove = (moveEvent: TouchEvent) => {
                                  const rect = container.getBoundingClientRect();
                                  const newPos = Math.max(0, Math.min(100, ((moveEvent.touches[0].clientX - rect.left) / rect.width) * 100));
                                  handleSliderChange(project.id, newPos);
                                };

                                const handleTouchEnd = () => {
                                  document.removeEventListener('touchmove', handleTouchMove);
                                  document.removeEventListener('touchend', handleTouchEnd);
                                };

                                document.addEventListener('touchmove', handleTouchMove);
                                document.addEventListener('touchend', handleTouchEnd);
                              }}
                            >
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-4 shadow-xl">
                                <div className="flex gap-1.5">
                                  <div className="w-1 h-8 bg-green-600 rounded-full"></div>
                                  <div className="w-1 h-8 bg-green-600 rounded-full"></div>
                                </div>
                              </div>
                            </div>

                            {/* Labels */}
                            <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs md:text-sm font-bold shadow-lg z-30">
                              Before
                            </div>
                            <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs md:text-sm font-bold shadow-lg z-30">
                              After
                            </div>

                            {/* Maximize Button */}
                            <button
                              onClick={() => {
                                setActiveLightboxProject(project);
                                setLightboxTab('after');
                              }}
                              className="absolute bottom-4 left-4 z-30 bg-black/75 hover:bg-green-600 text-white hover:scale-110 p-2.5 rounded-full backdrop-blur-sm transition-all shadow-lg"
                              title="View Full Size"
                            >
                              <Maximize2 className="w-5 h-5" />
                            </button>
                          </div>
                        )}

                        {/* Video Comparison */}
                        {isVideoProject && (
                          <div className="relative w-full aspect-[4/3] bg-black overflow-hidden">
                            {!isPlaying ? (
                              <div className="relative w-full h-full">
                                <video
                                  src={getMediaUrl(project.before_video_url)}
                                  className="w-full h-full object-contain"
                                  poster={getMediaUrl(project.before_image_url)}
                                />
                                <button
                                  onClick={() => toggleVideoPlayback(project.id)}
                                  className="absolute inset-0 flex items-center justify-center bg-black/50 hover:bg-black/60 transition-all"
                                >
                                  <div className="bg-green-600 hover:bg-green-700 text-white rounded-full p-6 shadow-2xl transform hover:scale-110 transition-all">
                                    <Play size={40} fill="currentColor" />
                                  </div>
                                </button>
                              </div>
                            ) : (
                              <div className="relative w-full h-full flex">
                                <div className="w-1/2 h-full relative">
                                  <video
                                    src={getMediaUrl(project.before_video_url)}
                                    autoPlay
                                    controls
                                    className="w-full h-full object-contain"
                                  />
                                  <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs md:text-sm font-bold shadow-lg z-10">
                                    Before
                                  </div>
                                </div>
                                <div className="w-1/2 h-full relative border-l-4 border-white">
                                  <video
                                    src={getMediaUrl(project.after_video_url)}
                                    autoPlay
                                    controls
                                    className="w-full h-full object-contain"
                                  />
                                  <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs md:text-sm font-bold shadow-lg z-10">
                                    After
                                  </div>
                                </div>
                                <button
                                  onClick={() => toggleVideoPlayback(project.id)}
                                  className="absolute bottom-4 right-4 bg-red-600 hover:bg-red-700 text-white rounded-full p-3 shadow-xl transition-all z-20"
                                >
                                  <Pause size={24} fill="currentColor" />
                                </button>
                              </div>
                            )}

                            {/* Maximize Button for Video */}
                            <button
                              onClick={() => {
                                setActiveLightboxProject(project);
                                setLightboxTab('after');
                              }}
                              className="absolute bottom-4 left-4 z-30 bg-black/75 hover:bg-green-600 text-white hover:scale-110 p-2.5 rounded-full backdrop-blur-sm transition-all shadow-lg"
                              title="View Full Size"
                            >
                              <Maximize2 className="w-5 h-5" />
                            </button>
                          </div>
                        )}

                        {/* Project Type Badge */}
                        {isVideoProject && !isImageProject && (
                          <div className="absolute top-4 right-20 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                            <Film size={12} />
                            VIDEO
                          </div>
                        )}
                        {isImageProject && !isVideoProject && (
                          <div className="absolute top-4 right-20 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                            <Image size={12} />
                            PHOTOS
                          </div>
                        )}
                        {isImageProject && isVideoProject && (
                          <div className="absolute top-4 right-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                            <Image size={12} />
                            <Film size={12} />
                          </div>
                        )}
                      </div>

                      {/* Project Info */}
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                            Project #{index + 1}
                          </span>
                        </div>
                        <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-3">{project.title}</h3>
                        {project.description && (
                          <p className="text-gray-600 leading-relaxed">{project.description}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-sm"
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-xl font-bold transition-all text-sm ${
                      currentPage === i + 1
                        ? 'bg-green-600 text-white shadow-lg shadow-green-600/30'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-sm"
                >
                  Next
                </button>
              </div>
            )}

            {/* Call to Action */}
            <div className="mt-16 text-center">
              <div className="bg-gradient-to-r from-green-50 to-yellow-50 rounded-3xl p-12 border-2 border-green-200 shadow-lg">
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4">Ready to Transform Your Garden?</h3>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg">
                  Let us create your own before and after transformation. Contact us today for a free consultation.
                </p>
                <Link
                  to="/#booking"
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl text-lg"
                >
                  <Leaf size={20} />
                  Book Your Free Consultation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Lightbox Modal */}
      {activeLightboxProject && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 md:p-8 animate-in fade-in duration-300">
          {/* Header Controls */}
          <div className="flex justify-between items-center w-full max-w-7xl mx-auto z-10 text-white mb-4">
            <div>
              <h4 className="text-xl md:text-2xl font-bold text-white leading-tight">{activeLightboxProject.title}</h4>
              {activeLightboxProject.description && (
                <p className="text-gray-400 text-xs md:text-sm mt-1">{activeLightboxProject.description}</p>
              )}
            </div>
            <button
              onClick={() => setActiveLightboxProject(null)}
              className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2.5 transition-colors focus:outline-none animate-pulse hover:animate-none"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 w-full max-w-7xl mx-auto flex items-center justify-between gap-4 relative">
            {/* Navigation - Left */}
            <button
              onClick={handlePrevProject}
              className="absolute left-0 md:left-4 z-20 bg-black/60 hover:bg-black/80 text-white border border-white/10 rounded-full p-3.5 hover:scale-105 transition-all focus:outline-none hidden sm:block shadow-2xl"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>

            {/* Dynamic Media View */}
            <div className="flex-1 h-full max-h-[70vh] md:max-h-[75vh] w-full flex items-center justify-center overflow-hidden rounded-2xl relative select-none">
              {(activeLightboxProject.media_type === 'video' || activeLightboxProject.media_type === 'both') && lightboxTab === 'before' && activeLightboxProject.before_video_url ? (
                <video
                  key={`before-vid-${activeLightboxProject.id}`}
                  src={getMediaUrl(activeLightboxProject.before_video_url)}
                  controls
                  autoPlay
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                />
              ) : (activeLightboxProject.media_type === 'video' || activeLightboxProject.media_type === 'both') && lightboxTab === 'after' && activeLightboxProject.after_video_url ? (
                <video
                  key={`after-vid-${activeLightboxProject.id}`}
                  src={getMediaUrl(activeLightboxProject.after_video_url)}
                  controls
                  autoPlay
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                />
              ) : (
                <img
                  key={`${lightboxTab}-${activeLightboxProject.id}`}
                  src={getMediaUrl(lightboxTab === 'before' ? activeLightboxProject.before_image_url : activeLightboxProject.after_image_url)}
                  alt={lightboxTab === 'before' ? 'Before transformation' : 'After transformation'}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
                />
              )}
            </div>

            {/* Navigation - Right */}
            <button
              onClick={handleNextProject}
              className="absolute right-0 md:right-4 z-20 bg-black/60 hover:bg-black/80 text-white border border-white/10 rounded-full p-3.5 hover:scale-105 transition-all focus:outline-none hidden sm:block shadow-2xl"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Controls */}
          <div className="w-full max-w-lg mx-auto flex flex-col items-center justify-center gap-4 z-10 py-4">
            {/* Before / After Selector Tabs */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-1 border border-white/10 flex w-full">
              <button
                onClick={() => setLightboxTab('before')}
                className={`flex-1 font-bold text-center py-2.5 rounded-lg text-sm transition-all ${
                  lightboxTab === 'before'
                    ? 'bg-green-600 text-white shadow-lg shadow-green-600/30'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Before View
              </button>
              <button
                onClick={() => setLightboxTab('after')}
                className={`flex-1 font-bold text-center py-2.5 rounded-lg text-sm transition-all ${
                  lightboxTab === 'after'
                    ? 'bg-green-600 text-white shadow-lg shadow-green-600/30'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                After View
              </button>
            </div>

            {/* Small Navigation for Mobile */}
            <div className="flex gap-4 sm:hidden w-full">
              <button
                onClick={handlePrevProject}
                className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-xl py-3 text-sm font-semibold transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>
              <button
                onClick={handleNextProject}
                className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-xl py-3 text-sm font-semibold transition-colors"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
