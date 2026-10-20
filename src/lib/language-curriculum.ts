import type { Difficulty, Lesson, Module, Resource, Track } from './curriculum'

/**
 * Language tracks are kept in their own module so the growing catalog stays
 * readable. They use the same Lesson/Module/Track shape as the web tracks, so
 * progress, search, sitemap, and lesson rendering work without special cases.
 */

const docs = (title: string, url: string, provider: string): Resource => ({
  type: 'docs',
  title,
  url,
  provider,
  isVerified: true,
})

const practice = (title: string, url: string, provider: string): Resource => ({
  type: 'interactive',
  title,
  url,
  provider,
  isVerified: true,
})

const lesson = (
  id: string,
  title: string,
  description: string,
  order: number,
  estimatedMinutes: number,
  difficulty: Difficulty,
  xpReward: number,
  keyTakeaways: string[],
  resources: Resource[]
): Lesson => ({
  id,
  title,
  description,
  order,
  estimatedMinutes,
  difficulty,
  xpReward,
  keyTakeaways,
  resources,
  isProject: id.includes('project') || id.includes('capstone'),
})

const module = (
  id: string,
  name: string,
  description: string,
  order: number,
  estimatedHours: number,
  color: string,
  lessons: Lesson[]
): Module => ({
  id,
  key: id,
  name,
  description,
  order,
  estimatedHours,
  icon: 'FileCode',
  color,
  lessons,
})

// ---------------------------------------------------------------------------
// C
// ---------------------------------------------------------------------------

const cDocs = {
  gcc: docs('GCC Online Documentation', 'https://gcc.gnu.org/onlinedocs/gcc/', 'GCC'),
  reference: docs('C Reference', 'https://en.cppreference.com/w/c', 'cppreference'),
  beej: docs("Beej's Guide to C Programming", 'https://beej.us/guide/bgc/', 'Beej'),
  make: docs('GNU Make Manual', 'https://www.gnu.org/software/make/manual/make.html', 'GNU'),
  gdb: docs('GDB Documentation', 'https://sourceware.org/gdb/documentation/', 'GNU'),
  valgrind: docs('Valgrind Quick Start', 'https://valgrind.org/docs/manual/quick-start.html', 'Valgrind'),
  asan: docs('AddressSanitizer', 'https://github.com/google/sanitizers/wiki/AddressSanitizer', 'Google'),
  pthreads: docs('POSIX Threads', 'https://man7.org/linux/man-pages/man7/pthreads.7.html', 'Linux man-pages'),
  sockets: docs("Beej's Guide to Network Programming", 'https://beej.us/guide/bgnet/', 'Beej'),
  http: docs('RFC 9110: HTTP Semantics', 'https://www.rfc-editor.org/rfc/rfc9110.html', 'IETF'),
  libc: docs('GNU C Library Manual', 'https://www.gnu.org/software/libc/manual/html_node/', 'GNU'),
  explorer: practice('Compiler Explorer', 'https://godbolt.org/', 'Compiler Explorer'),
}

const cModules: Module[] = [
  module(
    'c-foundations',
    'C Foundations',
    'From the compiler and first program to types, control flow, functions, arrays, strings, and a complete command-line project.',
    1,
    16,
    'blue',
    [
      lesson(
        'c-toolchain',
        'C Toolchain & Your First Program',
        'Understand what the compiler and linker actually do, write and run your first C program, enable warnings, and set up a minimal reproducible build.',
        1,
        180,
        'beginner',
        20,
        [
          'The difference between compiling and linking',
          'A portable GCC/Clang build command',
          'How warnings catch bugs before runtime',
          'A minimal Makefile worth keeping',
        ],
        [cDocs.gcc, cDocs.reference, cDocs.explorer]
      ),
      lesson(
        'c-types-control-flow',
        'Types, Variables & Control Flow',
        'Learn C integer and floating-point types, signedness, formatting, input, branching, and loops without relying on undefined behaviour.',
        2,
        210,
        'beginner',
        25,
        [
          'Choose integer widths deliberately',
          'Format values safely with printf and scanf',
          'Use switch and loops effectively',
          'Recognise overflow and truncation',
        ],
        [cDocs.reference, cDocs.beej, cDocs.gcc]
      ),
      lesson(
        'c-functions-arrays-strings',
        'Functions, Arrays & Strings',
        'Break programs into functions, pass arrays correctly, and work with null-terminated strings while respecting buffer boundaries.',
        3,
        240,
        'beginner',
        30,
        [
          'Declare functions before use',
          'Arrays decay to pointers in parameters',
          'C strings end with a null byte',
          'Prefer bounded string operations',
        ],
        [cDocs.reference, cDocs.beej, cDocs.libc]
      ),
      lesson(
        'c-project-calculator',
        'Project: Command-Line Calculator',
        'Build a multi-file calculator with a menu, safe numeric input, division-by-zero handling, modular functions, and a small regression checklist.',
        4,
        300,
        'beginner',
        40,
        [
          'Separate input, calculation, and output',
          'Validate input before converting it',
          'Organise headers and source files',
          'Test boundary cases, not just happy paths',
        ],
        [cDocs.make, cDocs.gcc, practice('C Playground', 'https://www.programiz.com/c-programming/online-compiler/', 'Programiz')]
      ),
    ]
  ),
  module(
    'c-systems',
    'Systems Programming in C',
    'Pointers, ownership, dynamic memory, files, debugging tools, and a persistent contact-book project.',
    2,
    22,
    'blue',
    [
      lesson(
        'c-pointers-memory',
        'Pointers, Memory & Structs',
        'Build a precise mental model of addresses, dereferencing, pointer arithmetic, structs, and the stack-versus-heap distinction.',
        1,
        240,
        'intermediate',
        30,
        [
          'Read pointer declarations from the identifier out',
          'Use const to document intent',
          'Access structs through pointers with ->',
          'Keep pointer lifetimes obvious',
        ],
        [cDocs.reference, cDocs.beej, cDocs.asan]
      ),
      lesson(
        'c-dynamic-memory',
        'Dynamic Memory & Data Structures',
        'Use malloc, calloc, realloc, and free correctly, then implement a growable vector and a singly linked list with clear ownership.',
        2,
        270,
        'intermediate',
        35,
        [
          'Every allocation needs one clear owner',
          'Check realloc without leaking the old buffer',
          'Free exactly once and null stale pointers',
          'Measure growth instead of reallocating every item',
        ],
        [cDocs.libc, cDocs.valgrind, cDocs.asan]
      ),
      lesson(
        'c-files-debugging',
        'Files, Errors & Debugging',
        'Read and write files safely, report failures with errno, and use GDB, sanitizers, and Valgrind to find real defects.',
        3,
        270,
        'intermediate',
        35,
        [
          'Check every I/O return value',
          'Use fgets for bounded line input',
          'Reproduce bugs under a debugger',
          'Run sanitizers in development builds',
        ],
        [cDocs.gdb, cDocs.valgrind, cDocs.asan]
      ),
      lesson(
        'c-project-contact-book',
        'Project: Contact Book in C',
        'Create a persistent CLI contact book with dynamic records, search, deletion, validation, file storage, and a repeatable test plan.',
        4,
        300,
        'intermediate',
        40,
        [
          'Design a small record and ownership model',
          'Keep persistence behind a narrow interface',
          'Handle malformed input without crashing',
          'Test add, search, update, and delete flows',
        ],
        [cDocs.make, cDocs.gdb, cDocs.valgrind]
      ),
    ]
  ),
  module(
    'c-mastery',
    'C Mastery',
    'Bit-level reasoning, concurrency, portable builds, and a socket-based HTTP server capstone.',
    3,
    28,
    'blue',
    [
      lesson(
        'c-bitwise-performance',
        'Bitwise Operations & Low-Level Performance',
        'Use masks, flags, shifts, and cache-aware data layouts, then measure changes instead of trusting intuition.',
        1,
        270,
        'advanced',
        40,
        [
          'Read and write hexadecimal masks',
          'Use shifts without undefined overflow',
          'Prefer contiguous data for hot loops',
          'Benchmark with representative inputs',
        ],
        [cDocs.reference, cDocs.explorer, cDocs.gcc]
      ),
      lesson(
        'c-processes-threads',
        'Processes, Threads & Concurrency',
        'Compare process isolation with shared-memory threads, then use pthreads, mutexes, condition variables, and signals safely.',
        2,
        300,
        'advanced',
        45,
        [
          'Understand fork and waitpid',
          'Protect shared state with a mutex',
          'Use condition variables for waiting',
          'Design shutdown and error paths',
        ],
        [cDocs.pthreads, cDocs.libc, cDocs.gdb]
      ),
      lesson(
        'c-libraries-make',
        'Libraries, Make & Portability',
        'Split code into reusable headers and libraries, build static and shared objects, and make the same source compile cleanly with GCC and Clang.',
        3,
        270,
        'advanced',
        40,
        [
          'Write include guards that work',
          'Distinguish static from shared libraries',
          'Use pattern rules and variables in Make',
          'Treat warnings and portability as features',
        ],
        [cDocs.make, cDocs.gcc, cDocs.reference]
      ),
      lesson(
        'c-capstone-http-server',
        'Capstone: A Small HTTP Server',
        'Build an educational HTTP server with sockets, request parsing, routing, responses, and graceful shutdown, then test it with curl.',
        4,
        360,
        'advanced',
        50,
        [
          'Follow the socket lifecycle from bind to accept',
          'Parse a request line and headers defensively',
          'Send correct status lines and headers',
          'State clearly what production would require',
        ],
        [cDocs.sockets, cDocs.http, cDocs.pthreads]
      ),
    ]
  ),
]

// ---------------------------------------------------------------------------
// C++
// ---------------------------------------------------------------------------

const cppDocs = {
  start: docs('Get Started with C++', 'https://isocpp.org/get-started', 'isocpp.org'),
  reference: docs('C++ Reference', 'https://en.cppreference.com/w/cpp', 'cppreference'),
  guidelines: docs('C++ Core Guidelines', 'https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines', 'isocpp.org'),
  cmake: docs('CMake Documentation', 'https://cmake.org/documentation/', 'CMake'),
  googletest: docs('GoogleTest Documentation', 'https://google.github.io/googletest/', 'Google'),
  catch2: docs('Catch2 Documentation', 'https://github.com/catchorg/Catch2/blob/devel/docs/Readme.md', 'Catch2'),
  algorithms: docs('C++ Algorithms Library', 'https://en.cppreference.com/w/cpp/algorithm', 'cppreference'),
  ranges: docs('C++ Ranges Library', 'https://en.cppreference.com/w/cpp/ranges', 'cppreference'),
  threads: docs('C++ Thread Support Library', 'https://en.cppreference.com/w/cpp/thread', 'cppreference'),
  jthread: docs('std::jthread', 'https://en.cppreference.com/w/cpp/thread/jthread', 'cppreference'),
  asan: docs('AddressSanitizer for Clang', 'https://clang.llvm.org/docs/AddressSanitizer.html', 'LLVM'),
  explorer: practice('Compiler Explorer', 'https://godbolt.org/', 'Compiler Explorer'),
  presets: docs('CMake Presets', 'https://cmake.org/cmake/help/latest/manual/cmake-presets.7.html', 'CMake'),
}

const cppModules: Module[] = [
  module(
    'cpp-foundations',
    'Modern C++ Foundations',
    'A modern starting point: toolchain, references, classes, RAII, the STL, and a multi-file inventory project.',
    1,
    16,
    'indigo',
    [
      lesson(
        'cpp-toolchain',
        'Modern C++ Toolchain & First Program',
        'Set up a current compiler, understand the build pipeline, enable warnings, and create a minimal CMake project for C++20.',
        1,
        180,
        'beginner',
        20,
        [
          'Choose a language standard deliberately',
          'Compile, link, and run from the command line',
          'Turn warnings into a habit',
          'Use CMake without magic',
        ],
        [cppDocs.start, cppDocs.cmake, cppDocs.explorer]
      ),
      lesson(
        'cpp-types-functions',
        'Types, References & Functions',
        'Use references, const correctness, auto, overloads, strings, string_view, and range-based loops to write clear modern C++.',
        2,
        210,
        'beginner',
        25,
        [
          'Prefer references for non-owning parameters',
          'Use const to make intent visible',
          'Understand string versus string_view lifetimes',
          'Use structured bindings to unpack values',
        ],
        [cppDocs.reference, cppDocs.start, cppDocs.guidelines]
      ),
      lesson(
        'cpp-classes-raii-stl',
        'Classes, RAII & the STL',
        'Design small classes with constructors, destructors, and invariants, then use vector, map, optional, and standard algorithms instead of manual memory.',
        3,
        240,
        'beginner',
        30,
        [
          'Let destructors release resources automatically',
          'Keep class invariants enforceable',
          'Reach for standard containers first',
          'Use algorithms instead of hand-written loops',
        ],
        [cppDocs.guidelines, cppDocs.reference, cppDocs.algorithms]
      ),
      lesson(
        'cpp-project-inventory',
        'Project: Inventory CLI',
        'Build a multi-file inventory manager with classes, containers, file persistence, validation, CMake, and a small test plan.',
        4,
        300,
        'beginner',
        40,
        [
          'Separate domain logic from console I/O',
          'Persist data without leaking file details',
          'Validate input at the boundary',
          'Build and test through CMake targets',
        ],
        [cppDocs.cmake, cppDocs.googletest, cppDocs.explorer]
      ),
    ]
  ),
  module(
    'cpp-engineering',
    'C++ Engineering',
    'Templates, ownership, move semantics, testing, CMake, and a task-scheduler project.',
    2,
    22,
    'indigo',
    [
      lesson(
        'cpp-templates',
        'Templates & Generic Programming',
        'Write function and class templates, constrain them with concepts, and understand deduction, instantiation, and readable compiler errors.',
        1,
        240,
        'intermediate',
        30,
        [
          'Templates are compile-time code generation',
          'Use concepts to express requirements',
          'Keep generic interfaces small',
          'Read the first compiler error carefully',
        ],
        [cppDocs.reference, cppDocs.guidelines, cppDocs.explorer]
      ),
      lesson(
        'cpp-move-semantics',
        'Move Semantics & Smart Pointers',
        'Understand lvalues, rvalues, move construction, and ownership, then replace manual new/delete with unique_ptr and shared_ptr.',
        2,
        270,
        'intermediate',
        35,
        [
          'Move transfers resources, it does not erase them',
          'Follow the rule of zero whenever possible',
          'Use unique_ptr for exclusive ownership',
          'Break shared_ptr cycles with weak_ptr',
        ],
        [cppDocs.guidelines, cppDocs.reference, cppDocs.asan]
      ),
      lesson(
        'cpp-testing-cmake',
        'Testing, CMake & Dependencies',
        'Structure CMake targets and presets, add GoogleTest or Catch2, run sanitizers and static analysis, and manage dependencies explicitly.',
        3,
        270,
        'intermediate',
        35,
        [
          'Test targets should be real build targets',
          'Use presets for repeatable builds',
          'Run sanitizers in CI or development',
          'Pin and understand third-party dependencies',
        ],
        [cppDocs.cmake, cppDocs.presets, cppDocs.googletest]
      ),
      lesson(
        'cpp-project-task-scheduler',
        'Project: Task Scheduler',
        'Build a priority task scheduler with STL containers, custom comparators, time handling, serialization, and tests around ordering and failure cases.',
        4,
        300,
        'intermediate',
        40,
        [
          'Model priorities with a clear comparator',
          'Separate scheduling policy from storage',
          'Test ordering and tie-breaking',
          'Persist state without coupling the domain to a file format',
        ],
        [cppDocs.algorithms, cppDocs.cmake, cppDocs.catch2]
      ),
    ]
  ),
  module(
    'cpp-mastery',
    'C++ Mastery',
    'Ranges, concurrency, performance, ABI awareness, and a multithreaded HTTP server capstone.',
    3,
    28,
    'indigo',
    [
      lesson(
        'cpp-algorithms-ranges',
        'STL Algorithms, Ranges & Data-Oriented Design',
        'Compose algorithms, lambdas, projections, and ranges, and choose data layouts that make the common operation cheap.',
        1,
        270,
        'advanced',
        40,
        [
          'Prefer named algorithms to ad-hoc loops',
          'Use projections to avoid copies',
          'Compose range views lazily',
          'Measure the cost of allocations and copies',
        ],
        [cppDocs.algorithms, cppDocs.ranges, cppDocs.explorer]
      ),
      lesson(
        'cpp-concurrency',
        'Concurrency, Atomics & Thread Pools',
        'Use threads, jthread, mutexes, condition variables, atomics, futures, and a bounded thread pool while avoiding races and deadlocks.',
        2,
        300,
        'advanced',
        45,
        [
          'Know what data is shared and who protects it',
          'Prefer jthread for cooperative cancellation',
          'Use condition variables correctly with predicates',
          'Bound queues to apply backpressure',
        ],
        [cppDocs.threads, cppDocs.jthread, cppDocs.reference]
      ),
      lesson(
        'cpp-performance-abi',
        'Performance, Profiling & ABI Awareness',
        'Profile first, then reason about cache behaviour, allocation, small-string optimization, build flags, and stable binary interfaces.',
        3,
        270,
        'advanced',
        40,
        [
          'Profile with representative workloads',
          'Reduce allocations on hot paths',
          'Keep headers and ABI boundaries deliberate',
          'Use optimization flags only after correctness',
        ],
        [cppDocs.asan, cppDocs.guidelines, cppDocs.explorer]
      ),
      lesson(
        'cpp-capstone-http-server',
        'Capstone: Multithreaded HTTP Server',
        'Build an educational multithreaded HTTP server with an acceptor loop, worker threads, parsing, routing, responses, and graceful shutdown.',
        4,
        360,
        'advanced',
        50,
        [
          'Separate accept, parse, and handling stages',
          'Use a bounded queue for backpressure',
          'Shut down without dropping in-flight work',
          'Document the gap to production deployment',
        ],
        [cppDocs.threads, cppDocs.cmake, cppDocs.asan]
      ),
    ]
  ),
]

// ---------------------------------------------------------------------------
// C#
// ---------------------------------------------------------------------------

const csharpDocs = {
  tour: docs('A Tour of C#', 'https://learn.microsoft.com/en-us/dotnet/csharp/tour-of-csharp/', 'Microsoft Learn'),
  cli: docs('.NET CLI Overview', 'https://learn.microsoft.com/en-us/dotnet/core/tools/', 'Microsoft Learn'),
  types: docs('C# Type System', 'https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/types/', 'Microsoft Learn'),
  oop: docs('Object-Oriented Programming in C#', 'https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/object-oriented/', 'Microsoft Learn'),
  linq: docs('LINQ in C#', 'https://learn.microsoft.com/en-us/dotnet/csharp/linq/', 'Microsoft Learn'),
  async: docs('Asynchronous Programming with Async and Await', 'https://learn.microsoft.com/en-us/dotnet/csharp/asynchronous-programming/', 'Microsoft Learn'),
  ef: docs('Entity Framework Core', 'https://learn.microsoft.com/en-us/ef/core/', 'Microsoft Learn'),
  minimalApi: docs('Minimal APIs', 'https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis/', 'Microsoft Learn'),
  testing: docs('Unit Testing with dotnet test', 'https://learn.microsoft.com/en-us/dotnet/core/testing/unit-testing-with-dotnet-test', 'Microsoft Learn'),
  logging: docs('Logging in .NET', 'https://learn.microsoft.com/en-us/dotnet/core/extensions/logging', 'Microsoft Learn'),
  options: docs('Options Pattern in .NET', 'https://learn.microsoft.com/en-us/dotnet/core/extensions/options', 'Microsoft Learn'),
  channels: docs('System.Threading.Channels', 'https://learn.microsoft.com/en-us/dotnet/standard/parallel-programming/channels', 'Microsoft Learn'),
  diagnostics: docs('.NET Diagnostics', 'https://learn.microsoft.com/en-us/dotnet/core/diagnostics/', 'Microsoft Learn'),
  di: docs('Dependency Injection in .NET', 'https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection', 'Microsoft Learn'),
  health: docs('Health Checks in ASP.NET Core', 'https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/health-checks', 'Microsoft Learn'),
  spans: docs('Memory and Spans', 'https://learn.microsoft.com/en-us/dotnet/standard/memory-and-spans/', 'Microsoft Learn'),
  benchmark: docs('BenchmarkDotNet', 'https://learn.microsoft.com/en-us/dotnet/core/diagnostics/benchmarkdotnet', 'Microsoft Learn'),
  security: docs('ASP.NET Core Security', 'https://learn.microsoft.com/en-us/aspnet/core/security/', 'Microsoft Learn'),
}

const csharpModules: Module[] = [
  module(
    'csharp-foundations',
    '.NET Foundations',
    'The .NET toolchain, object-oriented C#, collections, LINQ, async, and a console expense tracker.',
    1,
    16,
    'violet',
    [
      lesson(
        'csharp-dotnet-toolchain',
        '.NET Toolchain & Your First C# Program',
        'Install and inspect the .NET SDK, create and run a project, understand top-level statements and namespaces, and publish a Release build.',
        1,
        180,
        'beginner',
        20,
        [
          'SDK versus runtime',
          'What dotnet new and dotnet run do',
          'How project files describe a build',
          'Debug versus Release publishing',
        ],
        [csharpDocs.cli, csharpDocs.tour, csharpDocs.types]
      ),
      lesson(
        'csharp-oop-records',
        'Classes, Records, Interfaces & OOP',
        'Model data with properties, constructors, interfaces, records, and composition, and understand equality and immutability.',
        2,
        210,
        'beginner',
        25,
        [
          'Interfaces describe capabilities',
          'Records simplify value-oriented data',
          'Composition is often clearer than deep inheritance',
          'Use access modifiers to protect invariants',
        ],
        [csharpDocs.oop, csharpDocs.types, csharpDocs.tour]
      ),
      lesson(
        'csharp-collections-linq-async',
        'Collections, LINQ & Async C#',
        'Choose collections, query them with LINQ, and write non-blocking async code with cancellation instead of blocking on Task.Result.',
        3,
        240,
        'beginner',
        30,
        [
          'Know the cost and ordering of common collections',
          'Deferred LINQ execution can surprise you',
          'Await instead of blocking',
          'Pass CancellationToken through async work',
        ],
        [csharpDocs.linq, csharpDocs.async, csharpDocs.types]
      ),
      lesson(
        'csharp-project-expense-tracker',
        'Project: Console Expense Tracker',
        'Build a layered console expense tracker with records, LINQ reports, JSON persistence, async file I/O, validation, and tests.',
        4,
        300,
        'beginner',
        40,
        [
          'Keep parsing, storage, and reporting separate',
          'Validate at the input boundary',
          'Use async APIs for file I/O',
          'Test totals and filters with fixed data',
        ],
        [csharpDocs.cli, csharpDocs.linq, csharpDocs.testing]
      ),
    ]
  ),
  module(
    'csharp-professional',
    'C# Application Development',
    'EF Core, ASP.NET Core, automated testing, logging, configuration, and a REST API project.',
    2,
    22,
    'violet',
    [
      lesson(
        'csharp-ef-core',
        'Data Access with EF Core',
        'Model relationships, create migrations, query with LINQ, and make deliberate choices about tracking, transactions, and connection strings.',
        1,
        240,
        'intermediate',
        30,
        [
          'A DbContext is a unit-of-work boundary',
          'Migrations are versioned schema changes',
          'No-tracking queries are cheaper for reads',
          'Never commit secrets to appsettings.json',
        ],
        [csharpDocs.ef, csharpDocs.types, csharpDocs.testing]
      ),
      lesson(
        'csharp-aspnet-minimal-api',
        'Building APIs with ASP.NET Core',
        'Create minimal API endpoints with model binding, validation, problem details, OpenAPI, authentication, and middleware.',
        2,
        270,
        'intermediate',
        35,
        [
          'Endpoints are request/response boundaries',
          'Return the right status code',
          'Keep handlers thin and services testable',
          'Authentication is not authorization',
        ],
        [csharpDocs.minimalApi, csharpDocs.security, csharpDocs.ef]
      ),
      lesson(
        'csharp-testing-logging',
        'Testing, Logging & Configuration',
        'Write unit and integration tests, use WebApplicationFactory, add structured logging, and load configuration from the right environment.',
        3,
        270,
        'intermediate',
        35,
        [
          'Test behaviour at the lowest useful level',
          'Integration tests catch wiring problems',
          'Log events, not string soup',
          'Bind settings through IOptions',
        ],
        [csharpDocs.testing, csharpDocs.logging, csharpDocs.options]
      ),
      lesson(
        'csharp-project-rest-api',
        'Project: REST API with EF Core',
        'Build a small production-shaped API with CRUD endpoints, DTOs, validation, pagination, EF Core, error handling, and integration tests.',
        4,
        300,
        'intermediate',
        40,
        [
          'Separate API contracts from database entities',
          'Paginate collection endpoints',
          'Use a consistent error shape',
          'Test through the HTTP boundary',
        ],
        [csharpDocs.minimalApi, csharpDocs.ef, csharpDocs.testing]
      ),
    ]
  ),
  module(
    'csharp-mastery',
    'C# Mastery',
    'Async streams, channels, performance, architecture, and a production-shaped API capstone.',
    3,
    28,
    'violet',
    [
      lesson(
        'csharp-async-streams-channels',
        'Async Streams, Channels & Background Work',
        'Stream results with IAsyncEnumerable, connect producers and consumers with Channel<T>, and run background services with cancellation and shutdown.',
        1,
        270,
        'advanced',
        40,
        [
          'Async streams fit incremental results',
          'Bound channels to apply backpressure',
          'BackgroundService has a real lifecycle',
          'Cancellation is part of the contract',
        ],
        [csharpDocs.channels, csharpDocs.async, csharpDocs.di]
      ),
      lesson(
        'csharp-performance-memory',
        'Performance, Span & Memory',
        'Measure allocations and throughput, use Span and Memory to reduce copying, pool buffers, and benchmark changes with BenchmarkDotNet.',
        2,
        300,
        'advanced',
        45,
        [
          'Profile before optimizing',
          'Spans are slices, not ownership',
          'Pooling trades simplicity for allocation pressure',
          'Benchmark realistic workloads',
        ],
        [csharpDocs.spans, csharpDocs.benchmark, csharpDocs.diagnostics]
      ),
      lesson(
        'csharp-architecture-background-services',
        'Architecture, DI & Production Services',
        'Use dependency injection lifetimes, health checks, resilient clients, configuration, and observability to make a service operable.',
        3,
        270,
        'advanced',
        40,
        [
          'Scoped services belong to one request',
          'Health checks are for operators',
          'Retries need timeouts and idempotency',
          'Design logs and metrics before an incident',
        ],
        [csharpDocs.di, csharpDocs.health, csharpDocs.security]
      ),
      lesson(
        'csharp-capstone-production-api',
        'Capstone: Production-Ready API',
        'Combine EF Core, validation, auth, background processing, tests, logging, metrics, Docker, and a deployment checklist in one service.',
        4,
        360,
        'advanced',
        50,
        [
          'Keep boundaries explicit as features grow',
          'Automate the repeatable parts of release',
          'Make failure visible and recoverable',
          'Document environment-specific setup',
        ],
        [csharpDocs.minimalApi, csharpDocs.ef, csharpDocs.diagnostics]
      ),
    ]
  ),
]

// ---------------------------------------------------------------------------
// Python
// ---------------------------------------------------------------------------

const pythonDocs = {
  tutorial: docs('The Python Tutorial', 'https://docs.python.org/3/tutorial/', 'Python'),
  library: docs('The Python Standard Library', 'https://docs.python.org/3/library/', 'Python'),
  venv: docs('Virtual Environments and Packages', 'https://docs.python.org/3/tutorial/venv.html', 'Python'),
  pathlib: docs('pathlib', 'https://docs.python.org/3/library/pathlib.html', 'Python'),
  errors: docs('Errors and Exceptions', 'https://docs.python.org/3/tutorial/errors.html', 'Python'),
  argparse: docs('argparse', 'https://docs.python.org/3/library/argparse.html', 'Python'),
  dataclasses: docs('dataclasses', 'https://docs.python.org/3/library/dataclasses.html', 'Python'),
  typing: docs('typing', 'https://docs.python.org/3/library/typing.html', 'Python'),
  pytest: docs('pytest Documentation', 'https://docs.pytest.org/en/stable/', 'pytest'),
  asyncio: docs('asyncio', 'https://docs.python.org/3/library/asyncio.html', 'Python'),
  httpx: docs('HTTPX Documentation', 'https://www.python-httpx.org/', 'HTTPX'),
  fastapi: docs('FastAPI Tutorial', 'https://fastapi.tiangolo.com/tutorial/', 'FastAPI'),
  pydantic: docs('Pydantic Documentation', 'https://docs.pydantic.dev/latest/', 'Pydantic'),
  packaging: docs('Packaging Python Projects', 'https://packaging.python.org/en/latest/tutorials/packaging-projects/', 'Python Packaging Authority'),
  profile: docs('profile and cProfile', 'https://docs.python.org/3/library/profile.html', 'Python'),
  futures: docs('concurrent.futures', 'https://docs.python.org/3/library/concurrent.futures.html', 'Python'),
  logging: docs('logging', 'https://docs.python.org/3/library/logging.html', 'Python'),
  config: docs('The Twelve-Factor App: Config', 'https://12factor.net/config', '12factor.net'),
  subprocess: docs('subprocess', 'https://docs.python.org/3/library/subprocess.html', 'Python'),
  sqlite: docs('sqlite3', 'https://docs.python.org/3/library/sqlite3.html', 'Python'),
  ruff: docs('Ruff Documentation', 'https://docs.astral.sh/ruff/', 'Astral'),
  mock: docs('unittest.mock', 'https://docs.python.org/3/library/unittest.mock.html', 'Python'),
}

const pythonModules: Module[] = [
  module(
    'python-foundations',
    'Python Foundations',
    'The interpreter, collections, functions, modules, files, errors, and a persistent command-line project.',
    1,
    16,
    'amber',
    [
      lesson(
        'python-toolchain',
        'Python Toolchain & First Program',
        'Run Python scripts and modules, create a virtual environment, install dependencies, format code with Ruff, and understand the entry-point pattern.',
        1,
        180,
        'beginner',
        20,
        [
          'The interpreter runs source files directly',
          'Virtual environments isolate dependencies',
          'Modules are importable files and packages',
          'Keep executable code behind main guards',
        ],
        [pythonDocs.tutorial, pythonDocs.venv, pythonDocs.ruff]
      ),
      lesson(
        'python-collections-functions',
        'Collections, Control Flow & Functions',
        'Use lists, tuples, dictionaries, sets, slicing, comprehensions, functions, and argument unpacking while avoiding mutable-default traps.',
        2,
        210,
        'beginner',
        25,
        [
          'Choose the collection by its operations',
          'Comprehensions are readable when small',
          'Never use a mutable default argument',
          'Know when a value is shared',
        ],
        [pythonDocs.tutorial, pythonDocs.library, pythonDocs.argparse]
      ),
      lesson(
        'python-modules-files-errors',
        'Modules, Files & Errors',
        'Structure imports, work with pathlib, read and write files through context managers, and handle exceptions without swallowing failures.',
        3,
        240,
        'beginner',
        30,
        [
          'Imports are part of the program design',
          'pathlib avoids path-string bugs',
          'Context managers close files reliably',
          'Catch only errors you can handle',
        ],
        [pythonDocs.pathlib, pythonDocs.errors, pythonDocs.logging]
      ),
      lesson(
        'python-project-task-manager',
        'Project: CLI Task Manager',
        'Build a command-line task manager with argparse, JSON persistence, filtering, validation, tests, and a layout that can grow.',
        4,
        300,
        'beginner',
        40,
        [
          'Keep the command layer thin',
          'Store data behind a small repository',
          'Test behaviour with temporary files',
          'Make errors useful to the person running the tool',
        ],
        [pythonDocs.argparse, pythonDocs.pathlib, pythonDocs.pytest]
      ),
    ]
  ),
  module(
    'python-professional',
    'Python Professional',
    'Typed object-oriented design, pytest, async HTTP clients, and a FastAPI service project.',
    2,
    22,
    'amber',
    [
      lesson(
        'python-oop-typing',
        'OOP, Dataclasses & Type Hints',
        'Design classes with composition, use dataclasses and protocols, and add type hints that make refactoring safer without fighting the language.',
        1,
        240,
        'intermediate',
        30,
        [
          'Classes should protect invariants',
          'Dataclasses reduce boilerplate',
          'Protocols describe structural contracts',
          'Type hints are checked by tools, not at runtime',
        ],
        [pythonDocs.dataclasses, pythonDocs.typing, pythonDocs.tutorial]
      ),
      lesson(
        'python-testing-pytest',
        'Testing with pytest',
        'Write focused unit tests, use fixtures and parametrization, mock at boundaries, test exceptions, and measure meaningful coverage.',
        2,
        270,
        'intermediate',
        35,
        [
          'Arrange, act, assert',
          'Fixtures make setup explicit',
          'Parametrize instead of copying tests',
          'Mock boundaries, not your own logic',
        ],
        [pythonDocs.pytest, pythonDocs.mock, pythonDocs.errors]
      ),
      lesson(
        'python-async-http',
        'Async Python, HTTP & APIs',
        'Use the event loop deliberately, run concurrent requests with asyncio, add timeouts and retries, and build a typed HTTP client with HTTPX.',
        3,
        270,
        'intermediate',
        35,
        [
          'Await points are concurrency opportunities',
          'Timeouts are mandatory for network calls',
          'Retries need backoff and limits',
          'Not every I/O problem needs async',
        ],
        [pythonDocs.asyncio, pythonDocs.httpx, pythonDocs.tutorial]
      ),
      lesson(
        'python-project-fastapi',
        'Project: FastAPI Service',
        'Build a typed API with Pydantic models, validation, dependency injection, error handling, tests, and generated OpenAPI documentation.',
        4,
        300,
        'intermediate',
        40,
        [
          'Use schemas at the HTTP boundary',
          'Let validation return useful errors',
          'Inject dependencies instead of importing globals',
          'Test the API through its routes',
        ],
        [pythonDocs.fastapi, pythonDocs.pydantic, pythonDocs.pytest]
      ),
    ]
  ),
  module(
    'python-mastery',
    'Python Mastery',
    'Packaging, profiling, concurrency, production automation, and a data-pipeline capstone.',
    3,
    28,
    'amber',
    [
      lesson(
        'python-packaging',
        'Packaging & Project Structure',
        'Create a real package with pyproject.toml, build backends, dependency groups, entry points, versioning, and reproducible installs.',
        1,
        270,
        'advanced',
        40,
        [
          'pyproject.toml is the project contract',
          'Build backends package the distribution',
          'Pin what needs to be reproducible',
          'Console scripts replace copy-pasted commands',
        ],
        [pythonDocs.packaging, pythonDocs.venv, pythonDocs.ruff]
      ),
      lesson(
        'python-performance-concurrency',
        'Performance, Profiling & Concurrency',
        'Profile CPU and memory, choose threads, processes, or asyncio for the workload, and use pools without hiding failure handling.',
        2,
        300,
        'advanced',
        45,
        [
          'Measure before changing code',
          'Threads help I/O, processes help CPU-bound work',
          'The event loop is not a thread pool',
          'Bound concurrency to protect dependencies',
        ],
        [pythonDocs.profile, pythonDocs.futures, pythonDocs.asyncio]
      ),
      lesson(
        'python-production-automation',
        'Production Python & Automation',
        'Build operable scripts with environment configuration, structured logging, retries, idempotency, safe subprocesses, and useful health signals.',
        3,
        270,
        'advanced',
        40,
        [
          'Configuration belongs in the environment',
          'Idempotency makes retries safe',
          'Log context, not just messages',
          'Treat automation as software with failure modes',
        ],
        [pythonDocs.logging, pythonDocs.config, pythonDocs.subprocess]
      ),
      lesson(
        'python-capstone-data-pipeline',
        'Capstone: Automated Data Pipeline',
        'Build a tested pipeline that ingests data, validates it with Pydantic, transforms and persists it, reports failures, and can run repeatedly.',
        4,
        360,
        'advanced',
        50,
        [
          'Validate before transforming',
          'Make every stage restartable',
          'Record failures with enough context to debug',
          'Package the pipeline so another person can run it',
        ],
        [pythonDocs.pydantic, pythonDocs.sqlite, pythonDocs.logging]
      ),
    ]
  ),
]

export const languageTracks: Track[] = [
  {
    id: 'c',
    key: 'c',
    name: 'C',
    description: 'Go from your first compiled program to pointers, memory, concurrency, and a socket-based HTTP server. Built for people who want to understand the machine.',
    category: 'programming-languages',
    icon: 'FileCode',
    color: 'blue',
    modules: cModules,
  },
  {
    id: 'cpp',
    key: 'cpp',
    name: 'C++',
    description: 'Modern C++ from references and RAII to templates, move semantics, concurrency, performance, and a multithreaded server capstone.',
    category: 'programming-languages',
    icon: 'Braces',
    color: 'indigo',
    modules: cppModules,
  },
  {
    id: 'csharp',
    key: 'csharp',
    name: 'C#',
    description: 'Learn C# and .NET from the toolchain and LINQ through EF Core, ASP.NET Core, background services, and a production-shaped API capstone.',
    category: 'programming-languages',
    icon: 'Hash',
    color: 'violet',
    modules: csharpModules,
  },
  {
    id: 'python',
    key: 'python',
    name: 'Python',
    description: 'A complete Python path from syntax and collections to typing, testing, async APIs, packaging, automation, and a data-pipeline capstone.',
    category: 'programming-languages',
    icon: 'Terminal',
    color: 'amber',
    modules: pythonModules,
  },
]
