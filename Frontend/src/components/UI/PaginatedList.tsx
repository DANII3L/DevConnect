import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Search, Loader2, ChevronDown, X, RefreshCw } from 'lucide-react';
import { LoadingSpinner } from '../../UI/LoadingSpinner';
import { PAGINATION } from '../../utils/constants';
import { cn } from '../../utils/cn';

export interface FetchFunction<T> {
  (params: {
    page: number;
    limit: number;
    search?: string;
  }): Promise<{
    items: T[];
    total: number;
    success: boolean;
    error?: string;
  }>;
}

export interface PaginatedListProps<T> {
  // Función de fetch - nueva forma (prioritaria)
  fetchFunction?: FetchFunction<T>;

  // Datos y renderizado - forma antigua (para compatibilidad)
  items?: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  emptyState?: {
    icon?: React.ReactNode;
    title: string;
    description: string;
    action?: React.ReactNode;
  };

  // Paginación - forma antigua (para compatibilidad)
  total?: number;
  currentPage?: number;
  initialPageSize?: number;
  onPageChange?: (page: number, pageSize: number) => void;
  pageSizeOptions?: number[];

  // Búsqueda
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  searchValue?: string;
  enableSearch?: boolean;

  // Estados - forma antigua (para compatibilidad)
  loading?: boolean;
  error?: string | null;

  // Estilos
  containerClassName?: string;
  gridClassName?: string;
  searchClassName?: string;
  paginationClassName?: string;

  // Callbacks
  onLoadMore?: () => void;
  hasMore?: boolean;

  // Texto personalizado
  itemLabel?: string; // Etiqueta para los items (ej: "proyectos", "items", "resultados")

  // Callback para transformar datos (opcional)
  transformData?: (data: any) => T[];

  // Key para forzar refetch cuando cambia
  refetchKey?: number | string;
}

export function PaginatedList<T>({
  fetchFunction,
  items: externalItems,
  renderItem,
  emptyState,
  total: externalTotal,
  currentPage: externalCurrentPage,
  initialPageSize = PAGINATION.DEFAULT_LIMIT,
  onPageChange: externalOnPageChange,
  pageSizeOptions = [10, 20, 30, 50, 100],
  searchPlaceholder = 'Buscar...',
  onSearch: externalOnSearch,
  searchValue = '',
  enableSearch = true,
  loading: externalLoading,
  error: externalError,
  containerClassName = '',
  gridClassName = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  searchClassName = '',
  paginationClassName = '',
  onLoadMore,
  hasMore = false,
  itemLabel = 'items',
  transformData,
  refetchKey,
}: PaginatedListProps<T>) {
  // Estados internos (usados cuando fetchFunction está presente)
  const [internalItems, setInternalItems] = useState<T[]>([]);
  const [internalTotal, setInternalTotal] = useState(0);
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const [internalPageSize, setInternalPageSize] = useState<number>(initialPageSize);
  const [internalLoading, setInternalLoading] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(searchValue);

  // Determinar si usar fetch interno o props externos
  const useInternalFetch = !!fetchFunction;
  const items = useInternalFetch ? internalItems : (externalItems || []);
  const total = useInternalFetch ? internalTotal : (externalTotal || 0);
  const currentPage = useInternalFetch ? internalCurrentPage : (externalCurrentPage || 1);
  const pageSize = useInternalFetch ? internalPageSize : initialPageSize;
  const loading = useInternalFetch ? internalLoading : (externalLoading || false);
  const error = useInternalFetch ? internalError : externalError;
  const totalPages = Math.ceil(total / pageSize);

  // Función de fetch interno
  const fetchData = useCallback(async () => {
    if (!fetchFunction) return;

    setInternalLoading(true);
    setInternalError(null);
    try {
      const response = await fetchFunction({
        page: internalCurrentPage,
        limit: internalPageSize,
        search: searchQuery?.trim() || undefined,
      });

      if (response.success) {
        const transformedItems = transformData ? transformData(response.items) : response.items;
        setInternalItems(transformedItems);
        setInternalTotal(response.total);
      } else {
        setInternalError(response.error || 'Error al cargar datos');
        setInternalItems([]);
        setInternalTotal(0);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setInternalError(err instanceof Error ? err.message : 'Error al cargar datos');
      setInternalItems([]);
      setInternalTotal(0);
    } finally {
      setInternalLoading(false);
    }
  }, [fetchFunction, internalCurrentPage, internalPageSize, searchQuery, transformData]);

  // Debounce para búsqueda cuando usa fetch interno
  // Espera 500ms después de que el usuario deje de escribir
  useEffect(() => {
    if (!useInternalFetch) return;

    // Si la búsqueda está vacía, hacer fetch inmediato
    if (!searchQuery?.trim()) {
      setInternalCurrentPage(1);
      return;
    }

    const timer = setTimeout(() => {
      // Resetear a página 1 cuando cambia la búsqueda
      setInternalCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, useInternalFetch]);

  // Fetch cuando cambia la página, tamaño, búsqueda (después del debounce) o refetchKey
  useEffect(() => {
    if (useInternalFetch) {
      fetchData();
    }
  }, [internalCurrentPage, internalPageSize, refetchKey, useInternalFetch, fetchData]);

  // Sincronizar searchQuery cuando cambia searchValue desde el padre (solo si no usa fetch interno)
  useEffect(() => {
    if (!useInternalFetch && searchValue !== searchQuery) {
      setSearchQuery(searchValue);
    }
  }, [searchValue, useInternalFetch]);

  // Debounce para búsqueda - el padre maneja el reset a página 1 (solo si no usa fetch interno)
  useEffect(() => {
    if (useInternalFetch) return; // Si usa fetch interno, no necesita este debounce

    const timer = setTimeout(() => {
      if (externalOnSearch && searchQuery !== searchValue) {
        externalOnSearch(searchQuery);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, externalOnSearch, searchValue, useInternalFetch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setSearchQuery(newQuery);
    // El reset de página se maneja en el useEffect de debounce
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    if (useInternalFetch) {
      // Si usa fetch interno, resetear página
      setInternalCurrentPage(1);
    } else if (externalOnSearch) {
      externalOnSearch('');
    }
  };

  const handleRetrySearch = () => {
    if (useInternalFetch) {
      // Forzar refetch de la búsqueda actual
      fetchData();
    } else if (externalOnSearch && searchQuery) {
      // Si no usa fetch interno, notificar al padre
      externalOnSearch(searchQuery);
    }
  };

  const handlePageChange = (page: number, newPageSize: number) => {
    if (useInternalFetch) {
      setInternalCurrentPage(page);
      setInternalPageSize(newPageSize);
    } else if (externalOnPageChange) {
      externalOnPageChange(page, newPageSize);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1, pageSize);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1, pageSize);
    }
  };

  const handlePageClick = (page: number) => {
    handlePageChange(page, pageSize);
  };

  const handlePageSizeChange = (newSize: number) => {
    // Volver a la página 1 cuando cambia el tamaño
    handlePageChange(1, newSize);
  };

  // Calcular páginas a mostrar
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (loading && items.length === 0) {
    return (
      <div className={containerClassName}>
        <LoadingSpinner size="lg" className="py-20" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn(containerClassName, 'text-center py-20')}>
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 max-w-md mx-auto">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClassName}>
      {/* Barra de búsqueda */}
      {(enableSearch && (externalOnSearch || useInternalFetch)) && (
        <div className={`mb-6 ${searchClassName}`}>
          <div className="flex items-center gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder={searchPlaceholder}
                className="w-full pl-10 pr-10 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
                  title="Limpiar búsqueda"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={handleRetrySearch}
              disabled={loading}
              className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium whitespace-nowrap flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Reintentar búsqueda"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
            </button>
            {searchQuery && (
              <>
                <button
                  onClick={handleClearSearch}
                  className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium whitespace-nowrap flex items-center gap-2"
                  title="Limpiar búsqueda"
                >
                  <X className="w-4 h-4" />
                  Limpiar
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {items.length === 0 && !loading && emptyState && (
        <div className="text-center py-20">
          {emptyState.icon && (
            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-800 rounded-full mb-4">
              {emptyState.icon}
            </div>
          )}
          <h2 className="text-2xl font-semibold text-white mb-2">{emptyState.title}</h2>
          <p className="text-slate-400 mb-6">{emptyState.description}</p>
          {emptyState.action}
        </div>
      )}

      {/* Lista de items */}
      {items.length > 0 && (
        <>
          <div className={gridClassName}>
            {items.map((item, index) => (
              <div key={index}>
                {renderItem(item, index)}
              </div>
            ))}
          </div>

          {/* Selector de items por página - siempre visible */}
          <div className="mt-8 flex items-center justify-center gap-2">
            <label className="text-sm text-slate-400">Mostrar:</label>
            <div className="relative">
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
                disabled={loading}
                className="appearance-none px-4 py-2 pr-8 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {pageSizeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            <span className="text-sm text-slate-400">por página</span>
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className={`mt-8 flex items-center justify-center gap-2 ${paginationClassName}`}>
              {/* Controles de navegación */}
              <div className="flex items-center gap-2">
                {/* Botón anterior */}
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1 || loading}
                  className="px-3 py-2 bg-slate-800/50 hover:bg-slate-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Anterior</span>
                </button>

                {/* Números de página */}
                <div className="flex items-center gap-1">
                  {getPageNumbers().map((page, index) => {
                    if (page === '...') {
                      return (
                        <span key={`ellipsis-${index}`} className="px-2 text-slate-400">
                          ...
                        </span>
                      );
                    }

                    const pageNum = page as number;
                    const isActive = pageNum === currentPage;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageClick(pageNum)}
                        disabled={loading}
                        className={cn(
                          'px-4 py-2 rounded-lg transition-colors min-w-[40px]',
                          isActive
                            ? 'bg-blue-600 text-white font-semibold'
                            : 'bg-slate-800/50 hover:bg-slate-700 text-white',
                          loading && 'opacity-50 cursor-not-allowed'
                        )}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                {/* Botón siguiente */}
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages || loading}
                  className="px-3 py-2 bg-slate-800/50 hover:bg-slate-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <span className="hidden sm:inline">Siguiente</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Información de paginación */}
          <div className="mt-4 text-center text-sm text-slate-400">
            Mostrando {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, total)} de {total} {itemLabel}
          </div>

          {/* Botón cargar más (opcional) */}
          {onLoadMore && hasMore && (
            <div className="mt-6 text-center">
              <button
                onClick={onLoadMore}
                disabled={loading}
                className="px-6 py-3 bg-slate-800/50 hover:bg-slate-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Cargando...
                  </>
                ) : (
                  'Cargar más'
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

