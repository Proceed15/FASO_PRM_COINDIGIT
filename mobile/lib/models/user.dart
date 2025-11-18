class User {
  String? id;
  String name;
  String email;
  String? phone;
  String? address;
  String? photo;
  String? password;
  String? role;

  User({
    this.id,
    required this.name,
    required this.email,
    this.phone,
    this.address,
    this.photo,
    this.password,
    this.role,
  });

  factory User.fromJson(Map<String, dynamic> json) => User(
        id: json['id']?.toString(),
        name: json['name'] ?? json['Name'] ?? "",
        email: json['email'] ?? json['Email'] ?? "",
        phone: json['phone'] ?? json['Phone'],
        address: json['address'] ?? json['Address'],
        photo: json['photo'] ?? json['Photo'],
        role: json['role'] ?? json['Role'],
      );

  Map<String, dynamic> toJson() {
    final m = <String, dynamic>{};
    if (id != null) m['id'] = id;
    m['name'] = name;
    m['email'] = email;
    if (phone != null) m['phone'] = phone;
    if (address != null) m['address'] = address;
    if (photo != null) m['photo'] = photo;
    if (password != null) m['password'] = password;
    if (role != null) m['role'] = role;
    return m;
  }
}
