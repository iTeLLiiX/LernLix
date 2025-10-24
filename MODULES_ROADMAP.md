# 📚 LernLix Module Roadmap

> **Based on:** Christian-Schmidt-Schule Neckarsulm Curriculum
> **Focus:** C# Programming & Network Technology
> **Level:** Beginner to Advanced
> **Target Audience:** Ages 16-30 (Professional Development)

---

## 🎯 **C# PROGRAMMING MODULES**

### **Module 1: C# Einführung** 
**Category:** C#  
**Difficulty:** Beginner  
**Duration:** 45 minutes  
**Order:** 1

#### Content:
- .NET Framework Overview
- Common Language Infrastructure (CLI)
- Common Type System (CTS)
- Common Language Specification (CLS)
- Common Language Runtime (CLR)
- Framework Class Library (FCL)

#### Key Concepts:
```
- .NET Framework structure
- Cross-platform capabilities (Windows, Linux, MacOS)
- Three main components of .NET
- Why .NET matters for modern development
```

#### Learning Outcomes:
- ✅ Understand .NET Framework basics
- ✅ Know the three main components
- ✅ Understand CLR, CLI, CTS, CLS, FCL

---

### **Module 2: Hello World unter der Lupe**
**Category:** C#  
**Difficulty:** Beginner  
**Duration:** 60 minutes  
**Order:** 2

#### Content:
1. Das Programm "Hello World"
2. Using-Direktiven (Imports)
3. Namespace-Direktive
4. Die Klasse Program
5. Die Klassenmethode Main

#### Code Examples:
```csharp
using System;
using System.Collections.Generic;

namespace HelloWorld
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello, World!");
        }
    }
}
```

#### Key Concepts:
- Using statements for importing libraries
- Namespaces for code organization
- Classes and methods
- Main as entry point

#### Learning Outcomes:
- ✅ Write basic C# programs
- ✅ Understand program structure
- ✅ Know the purpose of Main method

---

### **Module 3: Variablen, Datentypen und Operatoren - Part 1**
**Category:** C#  
**Difficulty:** Beginner  
**Duration:** 90 minutes  
**Order:** 3

#### Content:
1. Datentypen in C#
   - Bool (true/false)
   - Integer Types (byte, short, int, long, etc.)
   - Floating Point (float, double, decimal)
   - String (Text)

2. Variablennamen Regeln
   - Must start with underscore or letter
   - Can contain letters, digits, underscores
   - No spaces allowed
   - Case sensitive
   - Cannot use reserved keywords

3. Reserved Keywords
   - Complete list of C# keywords

#### Code Examples:
```csharp
// Variable declarations
int intNumber = 42;
double doubleNumber = 3.14;
float floatNumber = 2.5f;
decimal decimalNumber = 19.99m;
bool isActive = true;
string name = "John Doe";

// Valid variable names
int myVariable;
int _privateVar;
int __unusualVar__;

// Invalid variable names
// int 4invalid;  // Can't start with number
// int while;     // Reserved keyword
```

#### Learning Outcomes:
- ✅ Understand all basic data types
- ✅ Know rules for variable naming
- ✅ Avoid reserved keywords

---

### **Module 4: Variablen, Datentypen und Operatoren - Part 2**
**Category:** C#  
**Difficulty:** Beginner  
**Duration:** 80 minutes  
**Order:** 4

#### Content:
1. Arithmetische Operatoren
   - Addition (+)
   - Subtraction (-)
   - Multiplication (*)
   - Division (/)
   - Modulo (%)

2. Zusammengesetzte Zuweisungsoperatoren
   - +=, -=, *=, /=
   - ++, --

#### Code Examples:
```csharp
// Arithmetic Operators
int a = 10;
int b = 3;

int sum = a + b;           // 13
int diff = a - b;          // 7
int product = a * b;       // 30
int quotient = a / b;      // 3
int remainder = a % b;     // 1

// Compound assignment
int x = 5;
x += 3;                    // x = 8
x -= 2;                    // x = 6
x *= 2;                    // x = 12

// Increment/Decrement
int i = 10;
i++;                       // i = 11
i--;                       // i = 10
```

#### Learning Outcomes:
- ✅ Perform arithmetic operations
- ✅ Use compound operators efficiently
- ✅ Understand increment/decrement

---

### **Module 5: Typumwandlungen im Überblick**
**Category:** C#  
**Difficulty:** Beginner  
**Duration:** 70 minutes  
**Order:** 5

#### Content:
1. Text in Zahl umwandeln (Parsing)
2. Zahl in Text umwandeln (ToString)
3. Typumwandlung zwischen Zahlentypen
   - Implizite Umwandlung
   - Explizite Umwandlung (Casting)

#### Code Examples:
```csharp
// String to Number
string intString = "42";
int intNumber = int.Parse(intString);

string doubleString = "3.14";
double doubleNumber = double.Parse(doubleString);

// Number to String
int value = 100;
string strValue = value.ToString();

// Type conversion
short a = 35;
int b = a;                 // Implicit (widening)

int e = 32000;
short d = (short)e;        // Explicit (narrowing with cast)

// Safe conversion with TryParse
if (int.TryParse("123", out int result))
{
    Console.WriteLine("Success: " + result);
}
```

#### Learning Outcomes:
- ✅ Convert strings to numbers
- ✅ Convert numbers to strings
- ✅ Understand implicit vs explicit casting
- ✅ Know when data loss occurs

---

## 🌐 **NETWORKING MODULES**

### **Module 6: Netzwerktechnik Grundlagen - AAA & ACL**
**Category:** Networking  
**Difficulty:** Beginner  
**Duration:** 45 minutes  
**Order:** 6

#### Content:
1. **AAA (Authentication, Authorization, Accounting)**
   - Authentication: Who are you?
   - Authorization: What can you do?
   - Accounting: What did you do?

2. **ACL (Access Control List)**
   - Filter rules
   - Allow/Deny policies
   - Firewall integration

#### Key Concepts:
```
AAA Framework:
- Authentication: Verify identity (Username/Password, 2FA, Biometrics)
- Authorization: Grant permissions (Role-based, Group-based)
- Accounting: Log activities (Compliance, Audit trails)

ACL Types:
- Standard ACL: Filter by source IP only
- Extended ACL: Filter by source, destination, protocol, port
- Named ACL: Use descriptive names
```

#### Real-World Examples:
- VPN access control
- Firewall rule sets
- Router access lists
- Network switch security

#### Learning Outcomes:
- ✅ Understand AAA framework
- ✅ Know ACL concepts
- ✅ Apply in firewall rules

---

### **Module 7: ARP & DHCP/APIPA**
**Category:** Networking  
**Difficulty:** Beginner  
**Duration:** 60 minutes  
**Order:** 7

#### Content:
1. **ARP (Address Resolution Protocol)**
   - Converts IP to MAC address
   - Works on local network
   - ARP cache
   - ARP spoofing (security)

2. **DHCP (Dynamic Host Configuration Protocol)**
   - Automatic IP assignment
   - DHCP lease
   - DHCP server/client

3. **APIPA (Automatic Private IP Addressing)**
   - 169.254.x.x range
   - Used when DHCP fails
   - Fallback mechanism

#### Scenarios:
```
ARP Flow:
1. Host A: "Who has IP 192.168.1.100?"
2. Host B: "I have 192.168.1.100, my MAC is XX:XX:XX:XX:XX:XX"
3. Host A: Stores mapping in ARP cache

DHCP Flow:
1. Client: DHCP Discover
2. Server: DHCP Offer (IP, Gateway, DNS)
3. Client: DHCP Request
4. Server: DHCP Ack (assigns IP)

APIPA Fallback:
- No DHCP server found
- Auto-assign 169.254.x.x
- Still can communicate locally
```

#### Learning Outcomes:
- ✅ Understand ARP process
- ✅ Configure DHCP
- ✅ Know APIPA fallback

---

### **Module 8: DNS & Domain Management**
**Category:** Networking  
**Difficulty:** Beginner  
**Duration:** 75 minutes  
**Order:** 8

#### Content:
1. **DNS (Domain Name System)**
   - Translates names to IPs
   - DNS hierarchy
   - DNS records (A, AAAA, CNAME, MX, TXT)

2. **FQDN (Fully Qualified Domain Name)**
   - Example: server.example.com
   - Host + Domain parts

3. **DNS Resolution Process**
   - Recursive query
   - DNS caching
   - DNS forwarding

#### Examples:
```
Domain: tellix.de
Subdomain: api.tellix.de
FQDN: api.tellix.de

DNS Records:
- A Record: tellix.de → 45.133.9.167
- AAAA Record: IPv6 address
- CNAME: www.tellix.de → tellix.de
- MX Record: Mail server
- TXT Record: SPF, DKIM verification
```

#### Learning Outcomes:
- ✅ Understand DNS system
- ✅ Know DNS records
- ✅ Configure domain names

---

### **Module 9: IPv4 & IPv6 Basics**
**Category:** Networking  
**Difficulty:** Intermediate  
**Duration:** 90 minutes  
**Order:** 9

#### Content:
1. **IPv4**
   - 32-bit addresses (192.168.0.1)
   - Dotted decimal notation
   - Subnetting
   - VLSM (Variable Length Subnet Mask)

2. **IPv6**
   - 128-bit addresses (2001:db8::1)
   - Hexadecimal notation
   - More addresses
   - Built-in security

3. **Dual-Stack**
   - Running IPv4 and IPv6 together
   - Transition period
   - Compatibility

#### IP Ranges:
```
Private IPv4:
- 10.0.0.0/8
- 172.16.0.0/12
- 192.168.0.0/16

IPv6 Example:
2a13:fd40:1:2::255

IPv6 Link-Local:
fe80::1
```

#### Learning Outcomes:
- ✅ Understand IPv4 & IPv6
- ✅ Perform subnetting
- ✅ Configure dual-stack

---

### **Module 10: Subnetting & VLSM**
**Category:** Networking  
**Difficulty:** Intermediate  
**Duration:** 120 minutes  
**Order:** 10

#### Content:
1. **IPv4 Subnetting**
   - Subnet masks
   - Network/Host bits
   - Calculating subnets
   - Planning address space

2. **VLSM (Variable Length Subnet Mask)**
   - Different subnet sizes
   - Efficient address usage
   - Multi-level hierarchy

#### Examples:
```
Network: 192.168.0.0/24

Standard Subnetting (/25):
- Subnet 1: 192.168.0.0/25 (0-127)
- Subnet 2: 192.168.0.128/25 (128-255)

VLSM Example:
- 192.168.0.0/24 → Subnet into:
  * 192.168.0.0/26 (64 addresses)
  * 192.168.0.64/26 (64 addresses)
  * 192.168.0.128/27 (32 addresses)
  * 192.168.0.160/28 (16 addresses)
```

#### Learning Outcomes:
- ✅ Calculate subnets
- ✅ Use VLSM for efficiency
- ✅ Plan IP addressing

---

### **Module 11: Routing Fundamentals**
**Category:** Networking  
**Difficulty:** Intermediate  
**Duration:** 85 minutes  
**Order:** 11

#### Content:
1. **Routing Basics**
   - Routing tables
   - Next hop concept
   - Static vs Dynamic routing
   - Router functions

2. **Routing Protocols**
   - OSPF (Open Shortest Path First)
   - BGP (Border Gateway Protocol)
   - RIP (Routing Information Protocol)

#### Routing Table Example:
```
Destination    Gateway         Interface
192.168.1.0    Direct          eth0
192.168.0.0    192.168.1.1     eth0
0.0.0.0        192.168.1.1     eth0 (Default)

Next Hop: 192.168.1.1
```

#### Learning Outcomes:
- ✅ Understand routing tables
- ✅ Know routing protocols
- ✅ Configure static routes

---

### **Module 12: Firewalls & DMZ**
**Category:** Networking  
**Difficulty:** Intermediate  
**Duration:** 80 minutes  
**Order:** 12

#### Content:
1. **Firewall Concepts**
   - Packet filtering
   - Stateful inspection
   - Application gateway

2. **DMZ (Demilitarized Zone)**
   - Network segmentation
   - Web/Mail/DNS servers
   - Internal network protection

#### DMZ Architecture:
```
[Internet]
    |
[Firewall]
    |
[DMZ: Web Server, Mail Server, DNS]
    |
[Firewall]
    |
[Internal Network: Workstations, Servers]
```

#### Learning Outcomes:
- ✅ Configure firewall rules
- ✅ Design DMZ
- ✅ Segment networks

---

### **Module 13: VPN & Encryption**
**Category:** Networking  
**Difficulty:** Advanced  
**Duration:** 100 minutes  
**Order:** 13

#### Content:
1. **VPN (Virtual Private Network)**
   - Tunneling
   - Encryption
   - VPN protocols (IPsec, SSL/TLS)
   - Site-to-site vs Remote access

2. **Encryption Methods**
   - Symmetric encryption
   - Asymmetric encryption
   - Hashing (MD5, SHA)

#### VPN Setup Example:
```
Remote Worker
    |
[Encrypted VPN Tunnel]
    |
Corporate Network
    ↓
Access to internal resources
```

#### Learning Outcomes:
- ✅ Understand VPN concepts
- ✅ Know encryption types
- ✅ Configure VPN connections

---

### **Module 14: WLAN & Wi-Fi Security**
**Category:** Networking  
**Difficulty:** Intermediate  
**Duration:** 75 minutes  
**Order:** 14

#### Content:
1. **WLAN Basics**
   - IEEE 802.11 standards
   - Channels and frequencies
   - Coverage and range

2. **Wi-Fi Security**
   - WEP (deprecated)
   - WPA/WPA2
   - WPA3 (latest)

#### Security Evolution:
```
WEP → Weak, deprecated
WPA → Improved, using TKIP
WPA2 → Strong, using AES
WPA3 → Latest, individualized data encryption
```

#### Learning Outcomes:
- ✅ Configure WLAN
- ✅ Implement WPA3
- ✅ Secure wireless networks

---

### **Module 15: Network Monitoring & SNMP**
**Category:** Networking  
**Difficulty:** Advanced  
**Duration:** 90 minutes  
**Order:** 15

#### Content:
1. **SNMP (Simple Network Management Protocol)**
   - Monitoring devices
   - Collecting metrics
   - Setting traps
   - SNMP versions

2. **Network Monitoring**
   - Traffic analysis
   - Performance metrics
   - Alerting

#### SNMP Example:
```
OID: 1.3.6.1.2.1.1.5.0
Name: System Description

Metrics:
- CPU Usage
- Memory
- Disk Space
- Network Traffic
```

#### Learning Outcomes:
- ✅ Configure SNMP
- ✅ Monitor networks
- ✅ Set up alerts

---

## 📋 **COMPLETE MODULE LIST**

### **C# Modules (5 total)**
| # | Title | Difficulty | Duration | Status |
|---|-------|-----------|----------|--------|
| 1 | C# Einführung | Beginner | 45 min | 📝 Ready |
| 2 | Hello World unter der Lupe | Beginner | 60 min | 📝 Ready |
| 3 | Variablen, Datentypen, Operatoren - Part 1 | Beginner | 90 min | 📝 Ready |
| 4 | Variablen, Datentypen, Operatoren - Part 2 | Beginner | 80 min | 📝 Ready |
| 5 | Typumwandlungen im Überblick | Beginner | 70 min | 📝 Ready |

### **Networking Modules (10 total)**
| # | Title | Difficulty | Duration | Status |
|---|-------|-----------|----------|--------|
| 6 | Netzwerktechnik Grundlagen - AAA & ACL | Beginner | 45 min | 📝 Ready |
| 7 | ARP & DHCP/APIPA | Beginner | 60 min | 📝 Ready |
| 8 | DNS & Domain Management | Beginner | 75 min | 📝 Ready |
| 9 | IPv4 & IPv6 Basics | Intermediate | 90 min | 📝 Ready |
| 10 | Subnetting & VLSM | Intermediate | 120 min | 📝 Ready |
| 11 | Routing Fundamentals | Intermediate | 85 min | 📝 Ready |
| 12 | Firewalls & DMZ | Intermediate | 80 min | 📝 Ready |
| 13 | VPN & Encryption | Advanced | 100 min | 📝 Ready |
| 14 | WLAN & Wi-Fi Security | Intermediate | 75 min | 📝 Ready |
| 15 | Network Monitoring & SNMP | Advanced | 90 min | 📝 Ready |

---

## 🚀 **IMPORTING MODULES INTO LERNLIX**

### **Admin Panel: Add Each Module**

```bash
# Example: Using cURL to add Module 1
curl -X POST https://tellix.de/api/modules \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "C# Einführung",
    "category": "c#",
    "description": ".NET Framework Overview and Structure",
    "difficulty": "beginner",
    "duration": 45,
    "order": 1,
    "content": {
      "text": "Learn the basics...",
      "codeExamples": [],
      "quiz": []
    }
  }'
```

---

## 💡 **FUTURE EXTENSIONS**

Possible additional modules:
- ✅ Classes & Objects (OOP)
- ✅ Inheritance & Polymorphism
- ✅ Exception Handling
- ✅ File I/O
- ✅ Database Integration
- ✅ Web APIs with ASP.NET
- ✅ Security Best Practices
- ✅ Load Balancing
- ✅ Network Virtualization (VLAN)
- ✅ Cloud Computing Basics

---

## 🎓 **LEARNING PATH**

### **Beginner Path (Weeks 1-2)**
1. C# Einführung
2. Hello World
3. Variables & Types (Part 1 & 2)
4. Type Conversions
5. Networking Basics

### **Intermediate Path (Weeks 3-4)**
6. ARP & DHCP
7. DNS
8. IPv4 & IPv6
9. Subnetting
10. Routing

### **Advanced Path (Weeks 5-6)**
11. Firewalls & DMZ
12. VPN & Encryption
13. WLAN Security
14. Network Monitoring

---

**All modules ready to import and deploy! 🚀**
