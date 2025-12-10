from typing import Optional

__all__ = ['__version__', 'debug', 'cuda', 'git_version', 'hip', 'xpu']
__version__ = '2.9.1+cpu'
debug = False
cuda: Optional[str] = None
git_version = '5811a8d7da873dd699ff6687092c225caffcf1bb'
hip: Optional[str] = None
xpu: Optional[str] = None
