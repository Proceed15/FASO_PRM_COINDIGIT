class User {
  String? id;
  String name;
  String email;
  String? role;
  String? phone;
  String? address;
  String? photo;
  String? password;

  User({
     this.id,
    required this.name,
    required this.email,
    this.role,
    this.phone,
    this.address,
    this.photo,
    this.password,
    //this.role,
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
    if (id != null) m['Id'] = id;
    m['Name'] = name;
    m['Email'] = email;
    if (phone != null) m['Phone'] = phone;
    if (address != null) m['Address'] = address;
    if (photo != null) m['Photo'] = photo;
    if (password != null) m['Password'] = password;
    if (role != null) m['Role'] = role;
    return m;
  }
}
